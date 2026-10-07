const jsonServer = require('json-server');
const cors = require('cors');
const db = require('../db.json'); // Statically imported so Vercel bundles it

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(cors({
  origin: '*', // Allow all origins for the Vercel deployment
  credentials: true
}));

server.use(middlewares);

// Initialize router with the statically imported object
// Note: On Vercel, this makes the DB read-only/in-memory for the lifetime of the function.
const router = jsonServer.router(db);

server.use('/api', router);

module.exports = server;
