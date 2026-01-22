# 🎯 DRESSIFY: Next Steps to Get Running

## **You Have Everything. Now What?**

All code has been implemented. Follow these steps to **start using DRESSIFY in 15 minutes**:

---

## **Phase 1: Get Firebase (5 min)**

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add Project"** or **"Create a project"**
3. Name: `dressify` (or any name)
4. Accept default settings, click **"Create"**

### 1.2 Enable Authentication
1. Left menu → **Authentication**
2. Click **"Get started"**
3. Click **Email/Password** provider
4. Toggle **Enable**, click **Save**

### 1.3 Create Firestore Database
1. Left menu → **Firestore Database**
2. Click **"Create Database"**
3. Select **"Start in test mode"** (for development)
4. Choose region `us-central1`, click **"Enable"**

### 1.4 Create Storage Bucket
1. Left menu → **Storage**
2. Click **"Get started"**
3. Accept default location, click **"Done"**

### 1.5 Get Your Config
1. Go to **Project Settings** (⚙️ icon, top-left)
2. Tab: **"Your Apps"**
3. Click **"</>"** icon to add web app
4. App name: `web`
5. Copy the config object → Save somewhere safe

**Your config looks like:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "dressify-xxx.firebaseapp.com",
  projectId: "dressify-xxx",
  storageBucket: "dressify-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc..."
};
```

---

## **Phase 2: Get Gemini API Key (2 min)**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Select your Firebase project
4. Copy the key → Save somewhere safe

---

## **Phase 3: Configure Your App (5 min)**

### 3.1 Backend Configuration
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=4000
FIREBASE_STORAGE_BUCKET=dressify-xxx.appspot.com   # From step 1.5
GOOGLE_GENERATIVE_AI_API_KEY=sk-...               # From phase 2
VITE_API_BASE_URL=http://localhost:5173
```

### 3.2 Frontend Configuration
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:4000

# From step 1.5:
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=dressify-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dressify-xxx
VITE_FIREBASE_STORAGE_BUCKET=dressify-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc...
```

---

## **Phase 4: Install & Run (3 min)**

### Option A: Direct (No Docker)
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev
# Should see: "Dressify backend running on 4000"

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
# Should see: "http://localhost:5173"
```

### Option B: Docker Compose (Even Easier)
```bash
# In project root
docker-compose up
# Wait 1-2 min for containers to start
# Backend: http://localhost:4000
# Frontend: http://localhost:5173
```

---

## **Phase 5: Test It! (1 min)**

1. Open **http://localhost:5173**
2. Click **"Sign Up"**
3. Enter email & password
4. Should redirect to home page ✅

Now test each feature:

### Test: Outfit Browsing
- Home page loads with outfit filters
- Filter by Country, Gender, Season, Festival
- Click **"View Styling Details"** to see recommendations

### Test: Image Upload
- Click **"📸 Upload"** button
- Upload a photo
- See AI-generated tags (colors, style, season, etc.)

### Test: AI Recommendations
- Click **"✨ AI Pick"** button
- Click **"🎯 Get AI Pick"**
- See ranked outfit suggestions

### Test: User Profile
- Click **"👤 Profile"** button
- Edit colors, budget, style
- Click **"Save Preferences"**
- See ✓ confirmation

---

## **Troubleshooting**

### "Port 4000 already in use"
```bash
# Kill the process (Mac/Linux)
lsof -ti:4000 | xargs kill -9

# Or use different port:
PORT=5000 npm run dev
```

### "Firebase config is invalid"
- Check all 6 fields in `frontend/.env` match your Firebase Console
- Don't use quotes around values
- Clear browser cache (Ctrl+Shift+Delete)

### "Image upload fails"
- Ensure Storage bucket exists in Firebase Console
- Check `FIREBASE_STORAGE_BUCKET` in `backend/.env`
- Image size < 10MB

### "AI recommendations are slow"
- Normal first time (10-15 sec while Gemini processes)
- Subsequent calls are faster
- Gemini API has rate limits (~60 req/min free tier)

### "Sign in not working"
- Check Email/Password is enabled in Firebase Auth
- Clear localStorage: Open DevTools → Application → Clear All

---

## **Next: Deploy to Production**

When you're ready to go live, follow the deployment section in:
- 📖 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

Options:
1. **Firebase Hosting** (easiest, free)
2. **Cloud Run** (backend only, serverless)
3. **Docker** (self-hosted anywhere)

---

## **What Each Button Does**

| Button | What it does |
|--------|-------------|
| **📸 Upload** | Upload outfit photo, get AI tags |
| **✨ AI Pick** | Get smart recommendations |
| **👤 Profile** | Edit style preferences |
| **♡ Save** | Bookmark outfit |
| **View Details** | See accessories, makeup, hairstyle tips |
| **Get AI Pick** | Run recommendation algorithm |
| **Save Preferences** | Store your colors, budget, style |

---

## **Features Checklist**

- ✅ Firebase Auth (sign up/in/out)
- ✅ Firestore (user data, uploads, preferences)
- ✅ Cloud Storage (outfit photos)
- ✅ Gemini AI (image tagging & recommendations)
- ✅ Responsive UI (mobile-friendly)
- ✅ Image upload with preview
- ✅ Outfit browsing & filtering
- ✅ User profiles & preferences
- ✅ Save/bookmark outfits
- ✅ Styling suggestions (accessories, makeup, hairstyle)

---

## **File Structure Reference**

```
DRESSIFY/
├── backend/
│   ├── server.js              ← All API endpoints
│   ├── package.json           ← Dependencies
│   ├── .env                   ← Your secrets (Firebase, Gemini)
│   └── Dockerfile             ← Production image
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            ← Main app with navigation
│   │   ├── components/
│   │   │   ├── Auth.jsx       ← Login/signup
│   │   │   ├── Profile.jsx    ← User preferences
│   │   │   ├── ImageUpload.jsx ← Upload & tagging
│   │   │   ├── Recommendations.jsx ← AI picks
│   │   │   ├── Filters.jsx    ← Browse filters
│   │   │   └── OutfitCard.jsx ← Outfit display
│   │   └── index.css          ← Tailwind styles
│   ├── package.json           ← Dependencies
│   ├── .env                   ← Your Firebase config
│   ├── vite.config.js         ← Build settings
│   └── Dockerfile             ← Production image
│
├── docker-compose.yml          ← One-command setup
├── DEPLOYMENT_GUIDE.md         ← Full deploy instructions
├── QUICK_START_UPDATED.md      ← Quick reference
└── FEATURE_SUMMARY.md          ← What was built
```

---

## **Still Stuck?**

1. **Check the logs:**
   - Backend: Look at terminal where `npm run dev` is running
   - Frontend: Open browser DevTools (F12) → Console

2. **Read the guides:**
   - [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Troubleshooting section
   - [QUICK_START_UPDATED.md](./QUICK_START_UPDATED.md) - Common issues

3. **Verify environment:**
   ```bash
   # Check Node version
   node --version  # Should be 16+
   
   # Check npm version
   npm --version   # Should be 7+
   ```

4. **Test API directly:**
   ```bash
   # Get list of outfits (no auth needed)
   curl http://localhost:4000/api/outfits
   ```

---

## **Success Criteria**

You'll know it's working when:

- [ ] Frontend loads at http://localhost:5173
- [ ] Can sign up with email/password
- [ ] Can upload an image and see AI tags
- [ ] Can click "Get AI Pick" and see recommendations
- [ ] Can save profile preferences
- [ ] Filters work on home page
- [ ] Can navigate between pages

---

## **Ready?**

1. Get Firebase credentials ↑ (Phase 1-2)
2. Update `.env` files ↑ (Phase 3)
3. Run `npm install && npm run dev` ↑ (Phase 4)
4. Visit http://localhost:5173 ↑ (Phase 5)

**Let's go! 🚀**

---

**Questions?** Re-read DEPLOYMENT_GUIDE.md or check the code comments.  
**Time to first run:** ~15 minutes (mostly waiting for Firebase project creation)
