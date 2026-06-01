const fs = require('fs');
const path = require('path');

const connectDB = async () => {
  const dataDir = process.env.DB_PATH || path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  console.log(`Database: NeDB (file-based) @ ${dataDir}`);
  console.log('For production: migrate to MongoDB Atlas — see backend/README.md');
};

module.exports = connectDB;
