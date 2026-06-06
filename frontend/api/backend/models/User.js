const mockUser = {
  _id: 'guest',
  name: 'Demo User',
  email: 'demo@test.com',
  phone: '+919999999999',
  role: 'customer',
  isVerified: true,
  walletBalance: 0,
  totalCashbackEarned: 0,
  address: '',
  gstin: '',
};

module.exports = {
  findById: () => Promise.resolve({ ...mockUser, save: () => {} }),
  findOne: () => Promise.resolve({ ...mockUser, save: () => {} }),
  find: () => ({
    select: () => Promise.resolve([]),
    sort: () => ({
      skip: () => ({
        limit: () => Promise.resolve([]),
      }),
    }),
  }),
  findByIdAndUpdate: () => Promise.resolve({ ...mockUser }),
  findOneAndUpdate: () => Promise.resolve({ ...mockUser }),
  countDocuments: () => Promise.resolve(0),
  create: (data) => Promise.resolve({ _id: 'new-user', ...data }),
  updateOne: () => Promise.resolve({ nModified: 0 }),
  deleteOne: () => Promise.resolve({ deletedCount: 0 }),
  deleteMany: () => Promise.resolve({ deletedCount: 0 }),
};
