const Datastore = require('nedb-promises');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const defaultDataDir = path.join(__dirname, '..', 'data');
function getDataDir() {
  const dir = process.env.DB_PATH || defaultDataDir;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}
if (!fs.existsSync(defaultDataDir)) {
  fs.mkdirSync(defaultDataDir, { recursive: true });
}

let stores = {};
let storeLocks = {};

function getStore(name) {
  if (!stores[name]) {
    stores[name] = Datastore.create({
      filename: path.join(getDataDir(), `${name}.db`),
      autoload: true,
    });
    storeLocks[name] = { queue: [], locked: false };
  }
  return stores[name];
}

async function withStoreLock(name, fn) {
  const lock = storeLocks[name];
  if (!lock) return fn();
  if (lock.locked) {
    return new Promise((resolve, reject) => {
      lock.queue.push({ resolve, reject });
    }).then(() => withStoreLock(name, fn));
  }
  lock.locked = true;
  try {
    return await fn();
  } finally {
    lock.locked = false;
    if (lock.queue.length > 0) {
      const next = lock.queue.shift();
      next.resolve();
    }
  }
}

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

function processQuery(q) {
  if (!q || typeof q !== 'object') return q;
  const processed = {};
  for (const [key, val] of Object.entries(q)) {
    if (key === '$or' || key === '$and') {
      processed[key] = val.map(v => processQuery(v));
    } else {
      processed[key] = val;
    }
  }
  return processed;
}

function matchDoc(doc, query) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const [key, cond] of Object.entries(query)) {
    if (key === '$or') {
      if (!cond.some(c => matchDoc(doc, c))) return false;
      continue;
    }
    if (key === '$and') {
      if (!cond.every(c => matchDoc(doc, c))) return false;
      continue;
    }
    const val = doc[key];
    if (cond && typeof cond === 'object' && !Array.isArray(cond)) {
      if ('$gt' in cond && !(val > cond.$gt)) return false;
      if ('$gte' in cond && !(val >= cond.$gte)) return false;
      if ('$lt' in cond && !(val < cond.$lt)) return false;
      if ('$lte' in cond && !(val <= cond.$lte)) return false;
      if ('$ne' in cond && val === cond.$ne) return false;
      if ('$in' in cond && !(cond.$in.includes(val))) return false;
      if ('$nin' in cond && cond.$nin.includes(val)) return false;
      if ('$exists' in cond && cond.$exists !== (val !== undefined)) return false;
      if ('$regex' in cond) {
        const flags = cond.$options || '';
        const re = new RegExp(cond.$regex, flags);
        if (!re.test(val)) return false;
      }
    } else {
      if (val !== cond) return false;
    }
  }
  return true;
}

class QueryBuilder {
  constructor(store, query) {
    this._store = store;
    this._query = query || {};
    this._sort = null;
    this._skip = 0;
    this._limitVal = null;
    this._populateFields = [];
    this._selectFields = null;
  }

  sort(obj) {
    this._sort = obj;
    return this;
  }

  skip(n) {
    this._skip = n;
    return this;
  }

  limit(n) {
    this._limitVal = n;
    return this;
  }

  select(str) {
    this._selectFields = str;
    return this;
  }

  populate(field, selectStr) {
    this._populateFields.push({ field, selectStr });
    return this;
  }

  async exec() {
    let docs;
    if (this._query && Object.keys(this._query).length > 0) {
      const allDocs = await this._store.find({});
      docs = allDocs.filter(d => matchDoc(d, this._query));
    } else {
      docs = await this._store.find({});
    }

    if (this._sort) {
      const keys = Object.keys(this._sort);
      docs.sort((a, b) => {
        for (const k of keys) {
          const dir = this._sort[k];
          if (a[k] < b[k]) return -1 * dir;
          if (a[k] > b[k]) return 1 * dir;
        }
        return 0;
      });
    }

    if (this._skip > 0) docs = docs.slice(this._skip);
    if (this._limitVal !== null) docs = docs.slice(0, this._limitVal);

    for (const { field, selectStr } of this._populateFields) {
      docs = await populateDocs(docs, field, selectStr);
    }

    if (this._selectFields) {
      const fields = this._selectFields.split(' ').filter(Boolean);
      docs = docs.map(d => {
        const obj = {};
        for (const f of fields) {
          if (f.startsWith('-')) continue;
          if (f in d) obj[f] = d[f];
        }
        return obj;
      });
    }

    return docs;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

async function populateDocs(docs, field, selectStr) {
  const ids = docs.map(d => {
    const v = d[field];
    return v && typeof v === 'object' ? v._id || v : v;
  }).filter(Boolean);

  if (ids.length === 0) return docs;

  const nameMap = { user: 'User', product: 'Product', category: 'Category', subcategory: 'Category' };
  const refStore = getStore(nameMap[field] || capitalizeFirst(field));
  const allRefs = await refStore.find({});
  const refMap = {};
  for (const r of allRefs) {
    if (ids.includes(r._id)) {
      if (selectStr) {
        const fields = selectStr.split(' ').filter(Boolean);
        const filtered = { _id: r._id };
        for (const f of fields) {
          if (f !== '-password') filtered[f] = r[f];
        }
        refMap[r._id] = filtered;
      } else {
        refMap[r._id] = r;
      }
    }
  }
  for (const d of docs) {
    const id = d[field] && typeof d[field] === 'object' ? d[field]._id || d[field] : d[field];
    if (id && refMap[id]) d[field] = refMap[id];
  }
  return docs;
}

function capitalizeFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function applyUpdate(doc, update) {
  for (const [op, data] of Object.entries(update)) {
    if (op === '$set') {
      for (const [k, v] of Object.entries(data)) {
        doc[k] = v;
      }
    } else if (op === '$inc') {
      for (const [k, v] of Object.entries(data)) {
        doc[k] = (doc[k] || 0) + v;
      }
    } else if (op === '$push') {
      for (const [k, v] of Object.entries(data)) {
        if (!doc[k]) doc[k] = [];
        doc[k].push(v);
      }
    } else if (op === '$pull') {
      for (const [k, v] of Object.entries(data)) {
        if (doc[k]) doc[k] = doc[k].filter(item => item !== v);
      }
    } else {
      for (const [k, v] of Object.entries(data)) {
        doc[k] = v;
      }
    }
  }
  doc.updatedAt = new Date().toISOString();
  return doc;
}

function createModel(name, schema = null) {
  const store = getStore(name);

  function sanitize(data) {
    if (!schema || !schema.allowedFields) return data;
    const clean = {};
    for (const field of schema.allowedFields) {
      if (data[field] !== undefined) clean[field] = data[field];
    }
    for (const [field, val] of Object.entries(schema.defaults || {})) {
      if (clean[field] === undefined) clean[field] = val;
    }
    for (const field of schema.required || []) {
      if (clean[field] === undefined || clean[field] === '') {
        throw new Error(`${field} is required`);
      }
    }
    return clean;
  }

  const model = {
    _store: store,
    _name: name,
    _schema: schema,

    find: (query = {}) => {
      return new QueryBuilder(store, processQuery(query));
    },

    findOne: async (query = {}) => {
      const docs = await store.find(processQuery(query));
      return docs[0] || null;
    },

    findById: async (id) => {
      const doc = await store.findOne({ _id: id });
      return doc || null;
    },

    findByIdAndUpdate: async (id, update, options = {}) => {
      const doc = await store.findOne({ _id: id });
      if (!doc) return null;
      let updateData = update;
      if (update.$set) {
        const clean = sanitize(update.$set);
        updateData = { $set: clean };
      } else if (!update.$inc && !update.$push && !update.$pull) {
        updateData = { $set: sanitize(update) };
      }
      const updated = applyUpdate(doc, updateData);
      await store.update({ _id: id }, updated);
      if (options.new !== false) return updated;
      return null;
    },

    findOneAndUpdate: async (query, update, options = {}) => {
      return withStoreLock(name, async () => {
        let doc = await store.findOne(processQuery(query));
        if (!doc) {
          if (options.upsert) {
            const insertData = {};
            if (update.$set) {
              Object.assign(insertData, sanitize(update.$set));
            } else {
              Object.assign(insertData, sanitize(update));
            }
            Object.assign(insertData, processQuery(query));
            insertData._id = generateId();
            insertData.createdAt = new Date().toISOString();
            insertData.updatedAt = new Date().toISOString();
            await store.insert(insertData);
            return insertData;
          }
          return null;
        }
        let updateData = update;
        if (update.$set) {
          updateData = { $set: sanitize(update.$set) };
        } else if (!update.$inc && !update.$push && !update.$pull) {
          updateData = { $set: sanitize(update) };
        }
        const updated = applyUpdate(doc, updateData);
        await store.update({ _id: doc._id }, updated);
        return options.new !== false ? updated : null;
      });
    },

    findByIdAndDelete: async (id) => {
      const doc = await store.findOne({ _id: id });
      if (doc) await store.remove({ _id: id });
      return doc;
    },

    countDocuments: async (query = {}) => {
      const allDocs = await store.find({});
      if (Object.keys(query).length === 0) return allDocs.length;
      return allDocs.filter(d => matchDoc(d, processQuery(query))).length;
    },

    insertMany: async (docs) => {
      const inserted = [];
      for (const d of docs) {
        const clean = sanitize(d);
        const doc = { ...clean, _id: d._id || generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        inserted.push(await store.insert(doc));
      }
      return inserted;
    },

    deleteMany: async (query = {}) => {
      const docs = await store.find(processQuery(query));
      for (const d of docs) {
        await store.remove({ _id: d._id });
      }
      return docs.length;
    },

    updateMany: async (query, update) => {
      const docs = await store.find(processQuery(query));
      for (const doc of docs) {
        const updated = applyUpdate(doc, update);
        await store.update({ _id: doc._id }, updated);
      }
      return docs.length;
    },

    aggregate: async (pipeline) => {
      let docs = await store.find({});
      for (const stage of pipeline) {
        if (stage.$match) {
          docs = docs.filter(d => matchDoc(d, processQuery(stage.$match)));
        } else if (stage.$group) {
          const groups = {};
          for (const d of docs) {
            let key;
            if (stage.$group._id === null) {
              key = 'all';
            } else if (typeof stage.$group._id === 'string') {
              key = d[stage.$group._id.replace('$', '')];
            } else if (typeof stage.$group._id === 'object') {
              key = JSON.stringify(stage.$group._id);
            } else {
              key = 'all';
            }
            if (!groups[key]) {
              groups[key] = { _id: key };
            }
            for (const [k, v] of Object.entries(stage.$group)) {
              if (k === '_id') continue;
              if (v.$sum) {
                const field = typeof v.$sum === 'string' ? v.$sum.replace('$', '') : null;
                groups[key][k] = (groups[key][k] || 0) + (field ? (d[field] || 0) : 1);
              }
            }
          }
          docs = Object.values(groups);
        } else if (stage.$lookup) {
          const refStore = getStore(stage.$lookup.from === 'products' ? 'Product' : capitalizeFirst(stage.$lookup.from));
          const refDocs = await refStore.find({});
          for (const d of docs) {
            const localVal = d[stage.$lookup.localField];
            d[stage.$lookup.as] = refDocs.filter(r => r[stage.$lookup.foreignField] === localVal);
          }
        } else if (stage.$unwind) {
          const field = stage.$unwind.replace('$', '');
          docs = docs.flatMap(d => {
            if (!Array.isArray(d[field]) || d[field].length === 0) return [d];
            return d[field].map(v => ({ ...d, [field]: v }));
          });
        } else if (stage.$project) {
          docs = docs.map(d => {
            const obj = {};
            for (const [k, v] of Object.entries(stage.$project)) {
              if (v === 1) obj[k] = d[k];
              else if (v.$subtract) {
                const a = v.$subtract[0].replace('$', '');
                const b = v.$subtract[1].replace('$', '');
                obj[k] = (d[a] || 0) - (d[b] || 0);
              } else if (typeof v === 'string' && v.startsWith('$')) {
                obj[k] = d[v.replace('$', '')];
              } else {
                obj[k] = v;
              }
            }
            return obj;
          });
        } else if (stage.$sort) {
          const keys = Object.keys(stage.$sort);
          docs.sort((a, b) => {
            for (const k of keys) {
              const dir = stage.$sort[k];
              if (a[k] < b[k]) return -1 * dir;
              if (a[k] > b[k]) return 1 * dir;
            }
            return 0;
          });
        } else if (stage.$limit) {
          docs = docs.slice(0, stage.$limit);
        }
      }
      return docs;
    },

    create: async (data) => {
      const clean = sanitize(data);
      const doc = { ...clean, _id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      if (doc.email) doc.email = doc.email.toLowerCase();
      return store.insert(doc);
    },

    updateById: async (id, updateFields) => {
      const doc = await store.findOne({ _id: id });
      if (!doc) return null;
      for (const [k, v] of Object.entries(updateFields)) {
        doc[k] = v;
      }
      doc.updatedAt = new Date().toISOString();
      await store.update({ _id: id }, doc);
      return doc;
    },
  };

  return model;
}

function clearStores() {
  stores = {};
}

module.exports = { createModel, getStore, clearStores };
