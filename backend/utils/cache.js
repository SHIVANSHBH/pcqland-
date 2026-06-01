const cache = new Map();

function get(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function set(key, value, ttlMs = 60000) {
  cache.set(key, { value, expiry: Date.now() + ttlMs });
}

function del(key) {
  cache.delete(key);
}

module.exports = { get, set, del };