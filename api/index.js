import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const jsonServer = require('json-server');
const cors = require('cors');
const db = require('../db.json');

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(cors({
  origin: '*',
  credentials: true
}));

server.use(middlewares);

const router = jsonServer.router(db);

server.use('/api', router);
server.use(router);

export default server;
