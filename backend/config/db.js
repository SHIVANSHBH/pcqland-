const fs = require('fs');
const path = require('path');

const connectDB = async () => {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  console.log('Using file-based dev database (nedb)');
  console.log(`Data directory: ${dataDir}`);
};

module.exports = connectDB;
