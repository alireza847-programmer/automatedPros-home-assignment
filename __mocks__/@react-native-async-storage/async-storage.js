const storage = {};

const AsyncStorageMock = {
  setItem: jest.fn((key, value) => {
    storage[key] = value;
    return Promise.resolve(value);
  }),
  getItem: jest.fn(key => Promise.resolve(storage[key] ?? null)),
  removeItem: jest.fn(key => {
    delete storage[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(storage).forEach(key => delete storage[key]);
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(storage))),
  flushGetRequests: jest.fn(() => Promise.resolve()),
};

module.exports = AsyncStorageMock;
