const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');

let db = null;
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, 'serviceAccount.json');

if (fs.existsSync(serviceAccountPath)) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath))
    });
    db = admin.firestore();
  } catch (err) {
    console.warn('Firebase initialization failed:', err.message);
  }
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    admin.initializeApp();
    db = admin.firestore();
  } catch (err) {
    console.warn('Firebase initialization failed:', err.message);
  }
} else {
  console.warn('Firebase service account not found. Using sample data fallback.');
}

const app = express();
app.use(cors());
app.use(express.json());

async function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return next();
  
  if (!admin.apps.length) {
    console.warn('Firebase not initialized, skipping token verification');
    return next();
  }
  
  const idToken = auth.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verify failed', err);
    res.status(401).json({ error: 'Invalid auth token' });
  }
}

app.use(verifyToken);

const outfitQuerySchema = Joi.object({
  country: Joi.string().optional(),
  gender: Joi.string().optional(),
  season: Joi.string().optional(),
  festival: Joi.string().optional()
});

app.get('/api/outfits', async (req, res) => {
  const { error, value } = outfitQuerySchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.message });
  try {
    if (!db) return res.json({ data: sampleOutfits(value) });
    let q = db.collection('outfits');
    Object.entries(value).forEach(([k, v]) => {
      if (v) q = q.where(k, '==', v);
    });
    const snap = await q.limit(50).get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/suggestions', async (req, res) => {
  try {
    if (!db) return res.json({ data: sampleSuggestions() });
    const snap = await db.collection('suggestions').limit(50).get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/stores', async (req, res) => {
  try {
    if (!db) return res.json({ data: sampleStores() });
    const snap = await db.collection('stores').limit(50).get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/user/preferences', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  const prefs = req.body;
  try {
    if (!db) return res.json({ ok: true, prefs });
    await db.collection('users').doc(req.user.uid).set({ preferences: prefs }, { merge: true });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Dressify backend running on ${PORT}`));

function sampleOutfits(filters) {
  return [
    { id: 'o1', title: 'Light Kurta Set', country: 'India', gender: 'female', season: 'summer', festival: 'diwali', description: 'Breathable cotton kurta with dupatta.' },
    { id: 'o2', title: 'Silk Saree', country: 'India', gender: 'female', season: 'winter', festival: 'wedding', description: 'Rich silk with zardosi work.' },
    { id: 'o3', title: 'Blazer & Chinos', country: 'USA', gender: 'male', season: 'fall', festival: 'casual', description: 'Smart casual for evenings.' }
  ].filter(o => Object.entries(filters||{}).every(([k,v]) => !v || String(o[k]).toLowerCase() === String(v).toLowerCase()));
}

function sampleSuggestions() {
  return [
    { id: 's1', outfitTitle: 'Light Kurta Set', accessories: ['jhumkas','mojris'], makeup: 'natural with kohl', hairstyle: 'braided bun' },
    { id: 's2', outfitTitle: 'Blazer & Chinos', accessories: ['leather watch'], makeup: 'n/a', hairstyle: 'neat side part' }
  ];
}

function sampleStores() {
  return [
    { id: 'st1', name: 'Ethnic Boutique', country: 'India', url: 'https://example.com/ethnic' },
    { id: 'st2', name: 'Modern Mens', country: 'USA', url: 'https://example.com/modern' }
  ];
}
