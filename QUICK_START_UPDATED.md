# 🚀 DRESSIFY: Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Node.js 16+ (or Docker)
- Firebase project
- Google Gemini API key

### Step 1: Clone & Install
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Step 2: Configure Environment
**Backend** (`backend/.env`):
```
PORT=4000
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
GOOGLE_GENERATIVE_AI_API_KEY=sk-...
VITE_API_BASE_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```
VITE_API_BASE_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=dressify-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dressify-xxx
VITE_FIREBASE_STORAGE_BUCKET=dressify-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc...
```

### Step 3: Run Locally
**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit: **http://localhost:5173**

### Alternative: Docker Compose (One-liner)
```bash
docker-compose up
```

---

## 📋 Feature Checklist

- ✅ **AI Recommendations** - Get smart outfit picks based on preferences
- ✅ **Image Upload** - Upload outfits, auto-tagged with AI
- ✅ **User Profiles** - Save preferences, colors, style, budget
- ✅ **Firebase Auth** - Email/password signup & login
- ✅ **Responsive UI** - Mobile-friendly design
- ✅ **Saved Outfits** - Bookmark favorite looks
- ✅ **Outfit Filters** - Browse by country, gender, season, occasion

---

## 🔗 API Endpoints

### Public
- `GET /api/outfits` - Browse outfits
- `GET /api/suggestions` - Get styling tips
- `GET /api/stores` - Find shopping locations

### Protected (Require Auth Token)
- `GET /api/user/profile` - Your profile
- `POST /api/user/preferences` - Update style preferences
- `POST /api/upload` - Upload outfit photos
- `POST /api/recommendations` - Get AI picks
- `POST /api/user/saved-outfits` - Save outfit
- `GET /api/user/saved-outfits` - View saved

---

## 🔑 Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable: **Auth (Email/Password)**, **Firestore**, **Storage**
4. Get config from: **Project Settings** → **Your Apps**
5. Paste values into `frontend/.env`

---

## 🤖 Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the key to `backend/.env` as `GOOGLE_GENERATIVE_AI_API_KEY`

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Port 4000 in use | Kill process: `lsof -ti:4000 \| xargs kill -9` |
| Firebase auth fails | Check `.env` config matches Firebase Console |
| Image upload fails | Ensure Firebase Storage bucket exists |
| Gemini errors | Verify API key and check quota limits |
| CORS errors | Backend CORS set to `http://localhost:5173` |

---

## 📚 Full Documentation

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- Production deployment (Cloud Run, Docker, self-hosted)
- API reference & testing
- Database structure
- Troubleshooting guide
- Enhancement ideas

---

## 🎯 Next Test to Try

1. **Sign up** with email
2. **Upload** an outfit photo
3. **Check tags** AI generated for your image
4. **Edit profile** preferences
5. **Get recommendation** from AI
6. **Save** your favorite outfit

---

**Let me know if you hit any snags!** 🎨
