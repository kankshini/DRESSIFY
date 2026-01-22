# 📚 DRESSIFY Documentation Index

## **Quick Navigation**

### 🚀 **I Just Want to Run It!**
→ Start here: [GETTING_STARTED.md](./GETTING_STARTED.md) (15 min setup)

### 📖 **I Want Full Details**
→ Read: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) (comprehensive guide)

### ⚡ **I'm in a Hurry**
→ Go to: [QUICK_START_UPDATED.md](./QUICK_START_UPDATED.md) (5 min reference)

### ✅ **What Was Built?**
→ Check: [FEATURE_SUMMARY.md](./FEATURE_SUMMARY.md) (complete feature list)

---

## **File Guide**

### **Setup & Deployment**
| Document | Best For | Read Time |
|----------|----------|-----------|
| **[GETTING_STARTED.md](./GETTING_STARTED.md)** | New users, first setup | 15 min |
| **[QUICK_START_UPDATED.md](./QUICK_START_UPDATED.md)** | Quick reference, troubleshooting | 5 min |
| **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** | Production deployment, detailed setup | 20 min |
| **[FEATURE_SUMMARY.md](./FEATURE_SUMMARY.md)** | Understanding what was built | 10 min |

### **Code Files**

**Backend** (`backend/`)
- `server.js` - All API endpoints (comments in code)
- `package.json` - Dependencies
- `.env.example` - Environment template
- `Dockerfile` - Container image

**Frontend** (`frontend/`)
- `src/App.jsx` - Main app, navigation, auth state
- `src/components/Auth.jsx` - Login/signup
- `src/components/Profile.jsx` - User preferences
- `src/components/ImageUpload.jsx` - Upload with AI tagging
- `src/components/Recommendations.jsx` - AI recommendations
- `src/components/Filters.jsx` - Browse filters
- `src/components/OutfitCard.jsx` - Outfit display
- `package.json` - Dependencies
- `.env.example` - Environment template
- `Dockerfile` - Container image

**Deployment**
- `docker-compose.yml` - Local development setup

---

## **The 5 Features**

### 1. **AI Recommendations**
Get smart outfit picks based on your style preferences and uploaded images.
- **What:** Uses Google Gemini to rank outfits by relevance
- **How:** Click "✨ AI Pick" button on home page
- **Endpoint:** `POST /api/recommendations`

### 2. **Image Upload**
Upload your outfit photos and get instant AI analysis.
- **What:** Detects colors, style, season, gender, occasions
- **How:** Click "📸 Upload" button, select image
- **Endpoint:** `POST /api/upload`

### 3. **User Profiles**
Save your style preferences and outfit bookmarks.
- **What:** Colors, budget, fashion style, bio
- **How:** Click "👤 Profile" button, edit preferences
- **Endpoints:** `POST/GET /api/user/preferences`, `POST/GET /api/user/saved-outfits`

### 4. **Firebase Integration**
- Authentication (sign up, login, logout)
- Cloud Firestore (save preferences, uploads, bookmarks)
- Cloud Storage (host outfit images)
- **Config:** Via `frontend/.env` and `backend/.env`

### 5. **Modern UI**
- Responsive design (mobile-friendly)
- Tab navigation (Home, Upload, AI, Profile)
- Loading states & error messages
- Gradient backgrounds & clean layout

---

## **Getting Started Roadmap**

```
Day 1: Setup
├─ Get Firebase project (5 min)
├─ Get Gemini API key (2 min)
├─ Update .env files (3 min)
├─ Install dependencies (2 min)
└─ Run locally (1 min)

Day 2: Testing
├─ Sign up & login
├─ Upload outfit image
├─ Get AI recommendations
├─ Edit profile preferences
└─ Explore all features

Day 3: Deploy
├─ Choose deployment option (Cloud Run, Docker, etc.)
├─ Deploy backend
├─ Deploy frontend
├─ Test in production
└─ Share with team
```

---

## **System Requirements**

- Node.js 16+ ([download](https://nodejs.org))
- npm 7+ (comes with Node)
- Git (optional, for version control)
- Docker (optional, for containerized setup)

**Or**: Use Docker Compose for everything in one command

---

## **30-Second Feature Demo**

1. **Sign up** → Email + password
2. **Upload** → Outfit photo → See AI tags
3. **Recommend** → Click "AI Pick" → Get ranked suggestions
4. **Profile** → Choose colors/style/budget → Save
5. **Browse** → Filter by country/season/gender → View details

---

## **API Endpoints Summary**

| Method | Endpoint | Protected | What It Does |
|--------|----------|-----------|-------------|
| GET | `/api/outfits` | ❌ | Browse all outfits |
| GET | `/api/suggestions` | ❌ | Get styling tips |
| GET | `/api/stores` | ❌ | Find shopping locations |
| GET | `/api/user/profile` | ✅ | Get user profile |
| POST | `/api/user/preferences` | ✅ | Save preferences |
| POST | `/api/upload` | ✅ | Upload outfit image |
| POST | `/api/recommendations` | ✅ | Get AI picks |
| POST | `/api/user/saved-outfits` | ✅ | Save outfit |
| GET | `/api/user/saved-outfits` | ✅ | Get saved outfits |

Protected = Requires Firebase Auth token

---

## **Tech Stack**

**Frontend**
- React 18 (UI framework)
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP requests)
- Firebase SDK (auth & storage)

**Backend**
- Express.js (web server)
- Firebase Admin SDK (database & auth)
- Google Generative AI (Gemini API)
- Multer (file uploads)

**Infrastructure**
- Firebase (auth, database, storage)
- Google Cloud (Gemini API, Cloud Run)
- Docker (containerization)

---

## **Environment Variables Explained**

### **Backend** (`backend/.env`)
```
PORT                              What port backend runs on
FIREBASE_STORAGE_BUCKET          Where images are stored
GOOGLE_GENERATIVE_AI_API_KEY     Gemini API for AI features
VITE_API_BASE_URL                Frontend URL (for CORS)
```

### **Frontend** (`frontend/.env`)
```
VITE_API_BASE_URL                Backend API endpoint
VITE_FIREBASE_API_KEY             Firebase public API key
VITE_FIREBASE_AUTH_DOMAIN         Firebase domain
VITE_FIREBASE_PROJECT_ID          Firebase project name
VITE_FIREBASE_STORAGE_BUCKET      Firebase storage bucket
VITE_FIREBASE_MESSAGING_SENDER_ID Firebase messaging ID
VITE_FIREBASE_APP_ID              Firebase app identifier
```

---

## **Common Tasks**

### **I want to run it locally**
```bash
# See GETTING_STARTED.md → Phase 4
cd backend && npm install && npm run dev  # Terminal 1
cd frontend && npm install && npm run dev # Terminal 2
```

### **I want to use Docker**
```bash
docker-compose up
# Waits 1-2 min, then ready to go
```

### **I want to deploy to production**
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- Firebase Hosting + Cloud Run (easiest)
- Docker Compose (self-hosted)
- Heroku/Railway (simple)

### **I want to understand the code**
Each file has inline comments explaining what it does. Start with:
- `frontend/src/App.jsx` (main app structure)
- `backend/server.js` (all endpoints)

---

## **Troubleshooting Quick Links**

| Problem | Solution |
|---------|----------|
| Port in use | Kill process: `lsof -ti:4000 \| xargs kill -9` |
| Firebase config error | Check all 6 fields in `frontend/.env` |
| Image upload fails | Ensure Storage bucket exists in Firebase |
| AI is slow | Normal first time; Gemini has rate limits |
| Auth not working | Enable Email/Password in Firebase Console |
| CORS errors | Check backend CORS origin settings |

Full troubleshooting: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md#-troubleshooting)

---

## **What's Included**

✅ Complete backend with all 5 features  
✅ Complete frontend with all UI components  
✅ Firebase integration (auth, database, storage)  
✅ Google Gemini AI integration  
✅ Docker setup for containerization  
✅ Deployment guides (3 options)  
✅ Environment templates & examples  
✅ Full API documentation  
✅ Troubleshooting guide  
✅ Quick start guide  

---

## **What You Need to Do**

1. **Get credentials** (15 min)
   - Firebase project setup
   - Gemini API key

2. **Update configs** (5 min)
   - Edit `backend/.env`
   - Edit `frontend/.env`

3. **Install & run** (2 min)
   - `npm install` in both directories
   - `npm run dev` to start

4. **Test locally** (5 min)
   - Sign up & login
   - Upload image
   - Get recommendations

---

## **Next Steps**

👉 **New to this?** Start with [GETTING_STARTED.md](./GETTING_STARTED.md)

👉 **Already familiar?** Go to [QUICK_START_UPDATED.md](./QUICK_START_UPDATED.md)

👉 **Need details?** Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

👉 **Want to know what was built?** Check [FEATURE_SUMMARY.md](./FEATURE_SUMMARY.md)

---

## **Support Resources**

| Resource | Type | Time |
|----------|------|------|
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Setup guide | 15 min |
| [QUICK_START_UPDATED.md](./QUICK_START_UPDATED.md) | Quick reference | 5 min |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Complete guide | 20 min |
| [FEATURE_SUMMARY.md](./FEATURE_SUMMARY.md) | Feature overview | 10 min |
| Code comments | Inline docs | As needed |

---

**Version:** 1.0.0  
**Last Updated:** January 22, 2026  
**Status:** Ready for Development & Deployment 🚀

**Let's build something amazing! 🎨**
