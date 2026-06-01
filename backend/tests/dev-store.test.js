const path = require('path');
const fs = require('fs');
const os = require('os');

describe('dev-store Model', () => {
  const { createModel, clearStores } = require('../config/dev-store');
  const testDir = path.join(os.tmpdir(), 'pcdeals-test-' + Date.now());

  beforeAll(() => {
    clearStores();
    process.env.DB_PATH = testDir;
  });

  beforeEach(() => {
    clearStores();
    try { fs.rmSync(testDir, { recursive: true, force: true }); } catch {}
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterAll(() => {
    clearStores();
    try { fs.rmSync(testDir, { recursive: true, force: true }); } catch {}
  });

  let counter = 0;

  test('creates and finds a document', async () => {
    const Model = createModel('T' + (counter++));
    const doc = await Model.create({ name: 'hello', price: 100 });

    expect(doc._id).toBeDefined();
    expect(doc.name).toBe('hello');

    const found = await Model.findById(doc._id);
    expect(found.name).toBe('hello');
  });

  test('findOne returns first match', async () => {
    const Model = createModel('T' + (counter++));
    await Model.create({ role: 'user', email: 'a@test.com' });
    await Model.create({ role: 'admin', email: 'b@test.com' });

    const found = await Model.findOne({ role: 'admin' });
    expect(found.email).toBe('b@test.com');
  });

  test('find returns QueryBuilder with exec', async () => {
    const Model = createModel('T' + (counter++));
    await Model.create({ name: 'x', price: 10 });
    await Model.create({ name: 'y', price: 20 });
    await Model.create({ name: 'z', price: 30 });

    const results = await Model.find({ price: { $gte: 20 } });
    expect(results).toHaveLength(2);
  });

  test('findByIdAndUpdate modifies document', async () => {
    const Model = createModel('T' + (counter++));
    const doc = await Model.create({ status: 'pending' });

    await Model.findByIdAndUpdate(doc._id, { status: 'paid' });
    const updated = await Model.findById(doc._id);
    expect(updated.status).toBe('paid');
  });

  test('findByIdAndDelete removes document', async () => {
    const Model = createModel('T' + (counter++));
    const doc = await Model.create({ name: 'delete-me' });

    await Model.findByIdAndDelete(doc._id);
    const found = await Model.findById(doc._id);
    expect(found).toBeNull();
  });
});
