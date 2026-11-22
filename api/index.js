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

// Ensure Vercel, proxies and browsers never cache dynamic API responses
server.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

server.use(jsonServer.bodyParser);
server.use(middlewares);

const router = jsonServer.router(activeDbPath);

// Normalization helper for websiteSettings
const normalizeSettingsPayload = (current = {}, incoming = {}) => {
  const merged = { ...current, ...incoming };
  
  // Resolve primary phone
  const phone = incoming.phone !== undefined 
    ? incoming.phone 
    : (incoming.primaryPhone !== undefined ? incoming.primaryPhone : merged.phone);

  // Resolve email
  const email = incoming.email !== undefined 
    ? incoming.email 
    : (incoming.supportEmail !== undefined ? incoming.supportEmail : (incoming.companyEmail !== undefined ? incoming.companyEmail : merged.email));

  // Resolve office location
  const office_location = incoming.office_location !== undefined 
    ? incoming.office_location 
    : (incoming.address !== undefined ? incoming.address : (incoming.officeLocation !== undefined ? incoming.officeLocation : merged.office_location));

  // Resolve whatsapp
  const whatsapp = incoming.whatsapp !== undefined 
    ? incoming.whatsapp 
    : (incoming.whatsappNumber !== undefined ? incoming.whatsappNumber : merged.whatsapp);

  // Resolve maps link
  const maps_link = incoming.maps_link !== undefined 
    ? incoming.maps_link 
    : (incoming.mapsLink !== undefined ? incoming.mapsLink : merged.maps_link);

  return {
    ...merged,
    phone,
    primaryPhone: phone,
    email,
    supportEmail: email,
    companyEmail: email,
    office_location,
    address: office_location,
    officeLocation: office_location,
    whatsapp,
    whatsappNumber: whatsapp,
    maps_link,
    mapsLink: maps_link,
    updated_at: new Date().toISOString()
  };
};

// Handle websiteSettings explicitly for guaranteed persistence and reliability
const handleGetSettings = (req, res) => {
  try {
    if (typeof router.db.read === 'function') {
      router.db.read();
    }
    const settings = router.db.get('websiteSettings').value() || {};
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

const handlePutSettings = (req, res) => {
  try {
    if (typeof router.db.read === 'function') {
      router.db.read();
    }
    const current = router.db.get('websiteSettings').value() || {};
    const updated = normalizeSettingsPayload(current, req.body);
    
    router.db.set('websiteSettings', updated).write();

    // Ensure synchronous file write to activeDbPath
    try {
      const fullState = router.db.getState();
      fs.writeFileSync(activeDbPath, JSON.stringify(fullState, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('Direct file sync notice:', fsErr?.message);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings: ' + (err?.message || err) });
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
