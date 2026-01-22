const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

let db = null;
let bucket = null;
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, 'serviceAccount.json');

// Initialize Firebase
if (fs.existsSync(serviceAccountPath)) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath)),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'dressify-prod.appspot.com'
    });
    db = admin.firestore();
    bucket = admin.storage().bucket();
  } catch (err) {
    console.warn('Firebase initialization failed:', err.message);
  }
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    admin.initializeApp({
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'dressify-prod.appspot.com'
    });
    db = admin.firestore();
    bucket = admin.storage().bucket();
  } catch (err) {
    console.warn('Firebase initialization failed:', err.message);
  }
} else {
  console.warn('Firebase service account not found. Using sample data fallback.');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const app = express();
app.use(cors({
  origin: process.env.VITE_API_BASE_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));

// Multer for image uploads (in-memory to send to Firebase)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Verify Firebase Auth Token
async function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  if (!admin.apps.length) {
    console.warn('Firebase not initialized, skipping token verification');
    req.user = null;
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

// Validation schemas
const outfitQuerySchema = Joi.object({
  country: Joi.string().optional(),
  gender: Joi.string().optional(),
  season: Joi.string().optional(),
  festival: Joi.string().optional()
});

const preferencesSchema = Joi.object({
  colors: Joi.array().items(Joi.string()).optional(),
  budget: Joi.string().optional(), // 'budget', 'mid-range', 'luxury'
  style: Joi.array().items(Joi.string()).optional(), // 'casual', 'formal', 'ethnic', etc.
  sizes: Joi.object().optional(),
  avatarUrl: Joi.string().optional(),
  bio: Joi.string().max(500).optional()
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
  
  const { error, value } = preferencesSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  try {
    if (!db) return res.json({ ok: true, preferences: value });
    
    await db.collection('users').doc(req.user.uid).set({ 
      preferences: value,
      email: req.user.email,
      updatedAt: new Date()
    }, { merge: true });
    
    res.json({ ok: true, preferences: value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/user/profile', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });

  try {
    if (!db) return res.json({ user: { uid: 'demo', email: 'demo@example.com', preferences: {} } });
    
    const doc = await db.collection('users').doc(req.user.uid).get();
    const userData = doc.exists ? doc.data() : { preferences: {} };
    
    res.json({ 
      user: { 
        uid: req.user.uid, 
        email: req.user.email,
        ...userData 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ Image Upload & AI Tagging ============
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  if (!req.file) return res.status(400).json({ error: 'No image provided' });

  try {
    if (!bucket) {
      return res.status(503).json({ error: 'Storage not available' });
    }

    // Generate filename
    const fileName = `uploads/${req.user.uid}/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);

    // Upload to Firebase Storage
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          uploadedBy: req.user.uid,
          uploadedAt: new Date().toISOString()
        }
      }
    });

    // Make file public
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // AI tagging with Gemini
    let tags = {};
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      try {
        const base64Image = req.file.buffer.toString('base64');
        const prompt = `Analyze this outfit image and provide:
1. Dominant colors (list 2-3)
2. Outfit style category (casual, formal, ethnic, street-style, etc.)
3. Season suitability (summer, winter, spring, fall, all-season)
4. Gender fit (male, female, unisex)
5. Occasion tags (work, party, casual, wedding, sports, etc.)
6. Brief description (1-2 sentences)

Respond in JSON format: { "colors": [...], "style": "...", "season": ["..."], "gender": "...", "occasions": [...], "description": "..." }`;

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: req.file.mimetype,
              data: base64Image
            }
          },
          prompt
        ]);

        try {
          const responseText = result.response.text();
          // Extract JSON from response
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            tags = JSON.parse(jsonMatch[0]);
          }
        } catch (parseErr) {
          console.warn('Failed to parse AI response:', parseErr.message);
        }
      } catch (aiErr) {
        console.warn('AI tagging failed:', aiErr.message);
      }
    }

    // Save upload metadata to Firestore
    if (db) {
      await db.collection('users').doc(req.user.uid).collection('uploads').add({
        fileName,
        publicUrl,
        mimeType: req.file.mimetype,
        tags,
        uploadedAt: new Date(),
        size: req.file.size
      });
    }

    res.json({ 
      ok: true, 
      url: publicUrl, 
      tags,
      metadata: {
        fileName,
        size: req.file.size,
        uploadedAt: new Date()
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// ============ AI Recommendations ============
app.post('/api/recommendations', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });

  const { uploadUrl, userPreferences } = req.body;
  if (!uploadUrl && !userPreferences) {
    return res.status(400).json({ error: 'Provide uploadUrl or userPreferences' });
  }

  try {
    // Get user profile
    let profile = { preferences: {} };
    if (db) {
      const doc = await db.collection('users').doc(req.user.uid).get();
      if (doc.exists) profile = doc.data();
    }

    // Merge input with stored preferences
    const preferences = { ...profile.preferences, ...userPreferences };

    // Get available outfits
    let outfits = sampleOutfits({});
    if (db) {
      const snap = await db.collection('outfits').limit(100).get();
      outfits = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    // AI-powered ranking
    let recommendations = [];
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY && model) {
      try {
        const outfitDescriptions = outfits
          .map(o => `${o.title}: ${o.description} (${o.country}, ${o.gender}, ${o.season}, ${o.festival})`)
          .join('\n');

        const prompt = `You are a fashion stylist. Based on the user's preferences and optionally an uploaded outfit image, rank the following outfits from most to least suitable. 

User Preferences: ${JSON.stringify(preferences)}
${uploadUrl ? `Uploaded Outfit Image URL: ${uploadUrl}` : ''}

Available Outfits:
${outfitDescriptions}

Return a JSON array of ranked outfit IDs with reasoning. Format: [{ "id": "...", "rank": 1, "reason": "..." }]`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const rankings = JSON.parse(jsonMatch[0]);
          recommendations = rankings.slice(0, 10).map(r => {
            const outfit = outfits.find(o => o.id === r.id);
            return { ...outfit, reason: r.reason, rank: r.rank };
          });
        }
      } catch (aiErr) {
        console.warn('AI recommendation failed:', aiErr.message);
        // Fallback: simple filter-based ranking
        recommendations = outfits.filter(o => {
          if (preferences.style && !preferences.style.includes(o.style)) return false;
          if (preferences.season && !o.season?.includes(preferences.season)) return false;
          return true;
        }).slice(0, 10).map((o, i) => ({ ...o, rank: i + 1, reason: 'Based on your preferences' }));
      }
    } else {
      // Fallback: simple filtering
      recommendations = outfits.slice(0, 10).map((o, i) => ({ ...o, rank: i + 1, reason: 'Popular choice' }));
    }

    res.json({ 
      ok: true, 
      recommendations,
      userContext: preferences 
    });
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ error: err.message || 'Recommendation failed' });
  }
});

// ============ Saved Outfits ============
app.post('/api/user/saved-outfits', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });

  const { outfitId, title } = req.body;
  if (!outfitId) return res.status(400).json({ error: 'outfitId required' });

  try {
    if (!db) return res.json({ ok: true });

    await db.collection('users').doc(req.user.uid).collection('savedOutfits').add({
      outfitId,
      title,
      savedAt: new Date()
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/user/saved-outfits', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });

  try {
    if (!db) return res.json({ data: [] });

    const snap = await db.collection('users').doc(req.user.uid).collection('savedOutfits').get();
    const saved = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    res.json({ data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Dressify backend running on ${PORT}`));

// ============ Sample Data ============
function sampleOutfits(filters) {
  return [
    { 
      id: 'o1', 
      title: 'Light Kurta Set', 
      country: 'India', 
      gender: 'female', 
      season: 'summer', 
      festival: 'diwali', 
      description: 'Breathable cotton kurta with dupatta.',
      style: 'ethnic',
      colors: ['cream', 'gold']
    },
    { 
      id: 'o2', 
      title: 'Silk Saree', 
      country: 'India', 
      gender: 'female', 
      season: 'winter', 
      festival: 'wedding', 
      description: 'Rich silk with zardosi work.',
      style: 'formal',
      colors: ['deep red', 'gold']
    },
    { 
      id: 'o3', 
      title: 'Blazer & Chinos', 
      country: 'USA', 
      gender: 'male', 
      season: 'fall', 
      festival: 'casual', 
      description: 'Smart casual for evenings.',
      style: 'casual',
      colors: ['navy', 'khaki']
    },
    { 
      id: 'o4', 
      title: 'Summer Dress', 
      country: 'USA', 
      gender: 'female', 
      season: 'summer', 
      festival: 'casual', 
      description: 'Light floral dress perfect for beach outings.',
      style: 'casual',
      colors: ['floral', 'white']
    }
  ].filter(o => Object.entries(filters||{}).every(([k,v]) => !v || String(o[k]).toLowerCase() === String(v).toLowerCase()));
}

function sampleSuggestions() {
  return [
    { 
      id: 's1', 
      outfitTitle: 'Light Kurta Set', 
      accessories: ['jhumkas','mojris'], 
      makeup: 'natural with kohl', 
      hairstyle: 'braided bun',
      stores: []
    },
    { 
      id: 's2', 
      outfitTitle: 'Blazer & Chinos', 
      accessories: ['leather watch'], 
      makeup: 'n/a', 
      hairstyle: 'neat side part',
      stores: []
    }
  ];
}

function sampleStores() {
  return [
    { id: 'st1', name: 'Ethnic Boutique', country: 'India', url: 'https://example.com/ethnic' },
    { id: 'st2', name: 'Modern Mens', country: 'USA', url: 'https://example.com/modern' }
  ];
}
