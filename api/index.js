const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

const cors = require('cors');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(cors({
  origin: ['https://www.kshireheaven.in', 'https://kshireheaven.in', 'https://ks-hire-heaven.vercel.app', 'http://localhost:3000'],
  credentials: true
}));

// Use /tmp for writable database on Vercel
const dbPath = path.join(__dirname, '../db.json');
const tmpDbPath = '/tmp/db.json';

try {
  if (!fs.existsSync(tmpDbPath)) {
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, tmpDbPath);
    } else {
      console.error('db.json not found at:', dbPath);
      fs.writeFileSync(tmpDbPath, JSON.stringify({ applications: [], jobs: [], recruiters: [], interviews: [] }));
    }
  }
} catch (error) {
  console.error('Error handling db.json:', error);
}

const router = jsonServer.router(fs.existsSync(tmpDbPath) ? tmpDbPath : dbPath);

server.use(middlewares);
server.use('/api', router);

module.exports = server;
