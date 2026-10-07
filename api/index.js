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
const dbPath = path.join(process.cwd(), 'db.json');
const tmpDbPath = '/tmp/db.json';

try {
  if (!fs.existsSync(tmpDbPath)) {
    fs.copyFileSync(dbPath, tmpDbPath);
  }
} catch (error) {
  console.error('Error copying db.json to /tmp:', error);
}

const router = jsonServer.router(fs.existsSync(tmpDbPath) ? tmpDbPath : dbPath);

server.use(middlewares);
server.use('/api', router);

module.exports = server;
