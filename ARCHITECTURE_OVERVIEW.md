# DRESSIFY: Complete Architecture & Setup Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DRESSIFY ECOSYSTEM                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      GOOGLE CLOUD SERVICES                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Firebase Console                                            │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  • Authentication (Email/Password)                          │  │
│  │  • Cloud Firestore (users, preferences, uploads, saved)    │  │
│  │  • Cloud Storage (outfit images)                            │  │
│  │  • Service Account (API credentials)                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Google Generative AI (Gemini)                              │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  • Image Analysis (colors, style, season, gender)          │  │
│  │  • Outfit Recommendations (ranking by preference)          │  │
│  │  • Rate Limited: ~60 req/min (free tier)                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                 ▲
                      ┌──────────┴──────────┐
                      │                     │
         ┌────────────▼──────────┐  ┌──────▼─────────────┐
         │   BACKEND SERVER      │  │   FRONTEND APP    │
         │   (Express.js)        │  │   (React/Vite)    │
         │   Node.js             │  │   Port: 5173      │
         │   Port: 4000          │  │                   │
         ├───────────────────────┤  ├───────────────────┤
         │ ENDPOINTS:            │  │ PAGES:            │
         │ ─────────────────────│  │ ─────────────────│
         │ GET /api/outfits     │  │ [Auth] Login      │
         │ GET /api/suggestions │  │ [Home] Browse     │
         │ GET /api/stores      │  │ [Upload] Photos   │
         │ POST /api/upload     │  │ [AI Pick] Rec.    │
         │ POST /api/recommend* │  │ [Profile] Prefs   │
         │ GET/POST /api/user/* │  │                   │
         │                       │  │ STATE:            │
         │ SECURITY:            │  │ ─────────────────│
         │ ─────────────────────│  │ Auth Token        │
         │ Token validation     │  │ Current User      │
         │ CORS enabled         │  │ Filters           │
         │                       │  │ Preferences       │
         │ LIBRARIES:           │  │                   │
         │ ─────────────────────│  │ LIBRARIES:        │
         │ express              │  │ ─────────────────│
         │ firebase-admin       │  │ react             │
         │ @google/gen-ai       │  │ firebase (client) │
         │ multer               │  │ axios             │
         │ joi (validation)     │  │ tailwindcss       │
         └─────────┬────────────┘  └──────┬────────────┘
                   │                      │
                   │ REST API (JSON)      │
                   └──────────────────────┘
```

---

## 🔄 Data Flow Examples

### **User Registration & Login**
```
User                    Frontend              Backend              Firebase
 │                        │                     │                    │
 ├─ Type email/pwd ─────>│                     │                    │
 │                        ├─ firebase.auth() ─────────────────────>│
 │                        │                 <─── ID Token ─────────┤
 │                        ├─ Store token in localStorage            │
 │<─ Redirect to home ────┤                     │                    │
 │                        │                     │                    │
```

### **Upload Outfit Image**
```
User              Frontend          Backend              Firebase Services
 │                   │                 │                      │
 ├─ Select image ──>│                 │                      │
 │<─ Show preview ───┤                 │                      │
 │                   │                 │                      │
 ├─ Click Upload ──>│                 │                      │
 │                   ├─ POST /api/upload + file ─────────>│
 │                   │                 ├─ Save to Storage ───────>│
 │                   │<─────────────────┤<─ Public URL ──────────│
 │                   │                 ├─ Analyze with Gemini ─>│
 │                   │                 │<─ { colors, style... }  │
 │                   │                 ├─ Save metadata to DB ─>│
 │                   │<─ { url, tags } ┤                      │
 │<─ Show tags ──────┤                 │                      │
 │                   │                 │                      │
```

### **Get AI Recommendations**
```
User              Frontend          Backend              Firebase & Gemini
 │                   │                 │                      │
 ├─ Click Get Rec ─>│                 │                      │
 │                   ├─ POST /recommendations ───────────>│
 │                   │                 ├─ Get user prefs from DB │
 │                   │                 ├─ Fetch all outfits ───>│
 │                   │<───────────────┤<─ Outfits ─────────────│
 │                   │                 ├─ Send to Gemini ─────>│
 │                   │                 ├─ Rank by relevance   │
 │                   │                 │<─ Ranked list ────────│
 │                   │<─ Top 10 ranked ┤                      │
 │<─ Show ranking ───┤                 │                      │
 │                   │                 │                      │
```

---

## 📂 Complete File Structure

```
DRESSIFY/
│
├── 📄 Documentation
│   ├── README_NEW.md                 ← Documentation index
│   ├── GETTING_STARTED.md            ← First-time setup (15 min)
│   ├── QUICK_START_UPDATED.md        ← Quick reference (5 min)
│   ├── DEPLOYMENT_GUIDE.md           ← Full setup & deploy guide
│   ├── FEATURE_SUMMARY.md            ← What was built
│   └── ARCHITECTURE_OVERVIEW.md      ← This file
│
├── 🐋 Deployment
│   ├── docker-compose.yml            ← One-command local setup
│   ├── .dockerignore                 ← Skip these files in Docker
│   └── .gitignore                    ← Version control exclusions
│
├── 📦 Backend
│   ├── server.js                     ← ALL API endpoints
│   ├── package.json                  ← Node dependencies
│   ├── package-lock.json             ← Dependency lock file
│   ├── .env                          ← YOUR secrets (not in git)
│   ├── .env.example                  ← Template for .env
│   ├── Dockerfile                    ← Production container
│   ├── serviceAccount.json           ← Firebase creds (not in git)
│   │
│   ├── 📁 lib/
│   │   └── firebase.js               ← Firebase initialization
│   │
│   └── 📁 scripts/
│       └── seedFirestore.js          ← Sample data loader
│
├── 📦 Frontend
│   ├── index.html                    ← HTML entry point
│   ├── vite.config.js                ← Vite build config
│   ├── tailwind.config.cjs           ← Tailwind theming
│   ├── postcss.config.cjs            ← CSS processing
│   ├── package.json                  ← React dependencies
│   ├── package-lock.json             ← Dependency lock file
│   ├── .env                          ← YOUR Firebase config
│   ├── .env.example                  ← Template for .env
│   ├── Dockerfile                    ← Production container
│   ├── Dockerfile.dev                ← Development container
│   ├── nginx.conf                    ← Web server config
│   │
│   └── 📁 src/
│       ├── main.jsx                  ← React entry point
│       ├── index.css                 ← Global styles (Tailwind)
│       ├── App.jsx                   ← Main component w/ routing
│       │
│       └── 📁 components/
│           ├── Auth.jsx              ← Login/signup page
│           ├── Profile.jsx           ← User preferences editor
│           ├── ImageUpload.jsx       ← Upload w/ preview
│           ├── Recommendations.jsx   ← AI recommendations
│           ├── Filters.jsx           ← Browse filters
│           └── OutfitCard.jsx        ← Outfit display card
│
├── 📄 Legacy Docs (keep for reference)
│   ├── CHANGE_LOG.md
│   ├── PROJECT_COMPLETION_REPORT.md
│   ├── README.md
│   └── ...other old files
│
└── 🔧 Configuration Files (auto-generated)
    ├── node_modules/                ← Installed packages
    ├── .git/                        ← Version control
    └── firebase.json                ← Firebase deploy config
```

---

## 🚀 Quick Start Paths

### **Path 1: Completely New (Recommended)**
```
1. Read: GETTING_STARTED.md (15 min)
2. Create Firebase project + Gemini API key
3. Update .env files
4. npm install + npm run dev
5. Test at http://localhost:5173
```

### **Path 2: Fast Refresh**
```
1. Scan: QUICK_START_UPDATED.md (5 min)
2. Check .env files are correct
3. npm install (if first time)
4. npm run dev
5. Done!
```

### **Path 3: Production Deploy**
```
1. Read: DEPLOYMENT_GUIDE.md
2. Choose: Cloud Run, Docker, or Heroku
3. Deploy backend
4. Deploy frontend
5. Update .env with production URLs
6. Monitor logs
```

### **Path 4: Understanding the Code**
```
1. Start: README_NEW.md (overview)
2. Read: FEATURE_SUMMARY.md (what was built)
3. Review: backend/server.js (all endpoints)
4. Review: frontend/src/App.jsx (main flow)
5. Explore: Individual components as needed
```

---

## 🔐 Security Layers

```
Level 1: Firebase Auth
  ↓
  ├─ Sign up / Login email + password
  ├─ Firebase creates ID token
  └─ Token stored in browser localStorage
           ↓
Level 2: Request Authorization
  ↓
  ├─ Every API call includes: Authorization: Bearer {token}
  └─ Backend middleware validates token
           ↓
Level 3: Endpoint Protection
  ↓
  ├─ Protected endpoints check req.user exists
  ├─ Only return data for authenticated user ID
  └─ Firestore rules enforce user-level access
           ↓
Level 4: Data Isolation
  ↓
  ├─ Users see only their own preferences
  ├─ Users see only their own uploads
  ├─ Users see only their own saved outfits
  └─ Public endpoints (browse) don't need auth
```

---

## 📊 Database Collections

```
Firebase Firestore Structure:

users/{userId}
  ├─ email: "user@example.com"
  ├─ preferences: { colors, budget, style, bio }
  ├─ updatedAt: timestamp
  ├─ uploads/ (subcollection)
  │  └─ {uploadId}
  │     ├─ publicUrl: "https://storage.googleapis.com/..."
  │     ├─ tags: { colors, style, season, gender, occasions, description }
  │     └─ uploadedAt: timestamp
  └─ savedOutfits/ (subcollection)
     └─ {saveId}
        ├─ outfitId: "o1"
        ├─ title: "Light Kurta Set"
        └─ savedAt: timestamp

outfits/{outfitId}
  ├─ title: "Light Kurta Set"
  ├─ description: "..."
  ├─ country: "India"
  ├─ gender: "female"
  ├─ season: "summer"
  ├─ festival: "diwali"
  ├─ style: "ethnic"
  └─ colors: ["cream", "gold"]

suggestions/{suggestionId}
  ├─ outfitTitle: "Light Kurta Set"
  ├─ accessories: ["jhumkas", "mojris"]
  ├─ makeup: "natural with kohl"
  └─ hairstyle: "braided bun"

stores/{storeId}
  ├─ name: "Ethnic Boutique"
  ├─ country: "India"
  └─ url: "https://example.com"
```

---

## 🔑 Environment Variables Needed

### **backend/.env**
```
PORT=4000
FIREBASE_STORAGE_BUCKET=dressify-xxx.appspot.com
GOOGLE_GENERATIVE_AI_API_KEY=sk-...
VITE_API_BASE_URL=http://localhost:5173
```

### **frontend/.env**
```
VITE_API_BASE_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=dressify-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dressify-xxx
VITE_FIREBASE_STORAGE_BUCKET=dressify-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc...
```

---

## 📈 Performance Metrics

| Component | Optimization | Details |
|-----------|--------------|---------|
| **Images** | Cloud Storage CDN | Firebase handles compression & caching |
| **Frontend** | Vite build | ~200KB gzipped (vs 1MB with webpack) |
| **CSS** | Tailwind purge | Only used styles bundled |
| **API** | Endpoint caching | Recommendations cached 1 hour |
| **Database** | Firestore indexes | Auto-indexed on common queries |
| **Auth** | Token caching | 1-hour expiry, auto-refresh on 401 |

---

## 🛠️ Development Workflow

```
1. Local Development
   ├─ npm install (dependencies)
   ├─ Create .env files (secrets)
   ├─ npm run dev (hot reload)
   └─ Test at localhost

2. Before Commit
   ├─ npm run build (production build)
   ├─ Check for errors/warnings
   ├─ Manual testing of features
   └─ .env NOT committed (in .gitignore)

3. Deployment
   ├─ docker build (create image)
   ├─ Push to registry (Docker Hub, GCP, etc.)
   └─ Deploy to platform (Cloud Run, self-host, etc.)

4. Post-Deploy
   ├─ Test in production
   ├─ Monitor error logs
   ├─ Monitor performance metrics
   └─ Set up alerts
```

---

## 🎯 Feature Priority

### **Must-Have (Current)**
- ✅ Image upload with AI tagging
- ✅ Outfit browsing & filtering
- ✅ User authentication
- ✅ Save favorites
- ✅ AI recommendations

### **Nice-to-Have (Phase 2)**
- 📌 Social features (share, follow, comment)
- 📌 Shopping integration (buy links)
- 📌 Weekly email digest
- 📌 Mobile app
- 📌 Advanced search

### **Future (Phase 3+)**
- 📌 Virtual try-on (AR)
- 📌 Body type recommendations
- 📌 Personal stylist chat
- 📌 Community challenges
- 📌 Premium subscriptions

---

## ✅ Pre-Launch Checklist

- [ ] Firebase project created
- [ ] Gemini API key obtained
- [ ] .env files configured
- [ ] Local dev tested end-to-end
- [ ] Docker images build successfully
- [ ] All features working locally
- [ ] Firestore rules reviewed
- [ ] Error logging configured
- [ ] Performance tested
- [ ] Team onboarded
- [ ] Domain/hosting selected
- [ ] Deployment plan ready
- [ ] Monitoring/alerts set up

---

## 🆘 Emergency Contacts

**Stuck on setup?**
1. Check GETTING_STARTED.md Phase 1-4
2. Check DEPLOYMENT_GUIDE.md troubleshooting
3. Verify .env variables match Firebase Console
4. Look at server logs: `npm run dev` output
5. Check browser console: F12 → Console tab

**API not working?**
```bash
# Test directly
curl http://localhost:4000/api/outfits
curl -X POST http://localhost:4000/api/recommendations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{}'
```

**Firebase not connected?**
1. Verify Firebase config in frontend/.env
2. Check service account in backend/
3. Ensure all Collections exist in Firestore
4. Check Firebase rules allow access

---

## 🎓 Learning Resources

**For Understanding DRESSIFY:**
- [FEATURE_SUMMARY.md](./FEATURE_SUMMARY.md) - What was built & why
- Code comments in server.js & App.jsx
- Architecture diagrams (this file)

**For Firebase:**
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)

**For React/Vite:**
- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)

**For Gemini AI:**
- [Google AI Studio](https://makersuite.google.com)
- [Generative AI Docs](https://ai.google.dev)

---

**Status:** 🟢 Ready for Development  
**Last Updated:** January 22, 2026  
**Version:** 1.0.0

---

Next step: Read [GETTING_STARTED.md](./GETTING_STARTED.md) 🚀
