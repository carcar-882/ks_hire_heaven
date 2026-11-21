import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const jsonServer = require('json-server');
const cors = require('cors');

const defaultDbPath = resolve(__dirname, '../db.json');
let activeDbPath = defaultDbPath;

// In Vercel serverless environment, the root is read-only, but /tmp is writable
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const tmpDbPath = '/tmp/db.json';
  if (!fs.existsSync(tmpDbPath)) {
    try {
      const initialData = fs.readFileSync(defaultDbPath, 'utf8');
      fs.writeFileSync(tmpDbPath, initialData, 'utf8');
    } catch (e) {
      console.warn('Error copying to /tmp:', e);
    }
  }
  if (fs.existsSync(tmpDbPath)) {
    activeDbPath = tmpDbPath;
  }
}

const server = jsonServer.create();
const middlewares = jsonServer.defaults({ noCache: true });

server.use(cors({
  origin: '*',
  credentials: true
}));

// Ensure Vercel and browsers never cache dynamic API responses
server.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

server.use(jsonServer.bodyParser);
server.use(middlewares);

const router = jsonServer.router(activeDbPath);

// Handle websiteSettings explicitly for guaranteed reliability
const handleGetSettings = (req, res) => {
  try {
    const settings = router.db.get('websiteSettings').value() || {};
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

const handlePutSettings = (req, res) => {
  try {
    const current = router.db.get('websiteSettings').value() || {};
    const updated = { ...current, ...req.body };
    router.db.set('websiteSettings', updated).write();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
};

server.get('/websiteSettings', handleGetSettings);
server.get('/api/websiteSettings', handleGetSettings);
server.put('/websiteSettings', handlePutSettings);
server.put('/api/websiteSettings', handlePutSettings);
server.post('/websiteSettings', handlePutSettings);
server.post('/api/websiteSettings', handlePutSettings);

server.use('/api', router);
server.use(router);

export default server;
