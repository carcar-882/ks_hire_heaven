const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

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
