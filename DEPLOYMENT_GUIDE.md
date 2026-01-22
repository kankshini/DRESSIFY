# DRESSIFY: Feature Implementation & Deployment Guide

## ✅ Features Implemented

### 1. **AI-Based Outfit Recommendations**
- **Endpoint:** `POST /api/recommendations`
- **Uses:** Google Gemini AI to rank outfits based on user preferences and uploaded images
- **Response:** Top 10 ranked outfits with reasoning
- **Frontend:** `Recommendations.jsx` component with one-click "Get AI Pick"
- **Fallback:** Simple filter-based ranking if Gemini API unavailable

### 2. **Image Upload & AI Tagging**
- **Endpoint:** `POST /api/upload`
- **Features:**
  - Multer-based file upload (max 10MB)
  - Auto-tags images with Gemini: colors, style, season, gender, occasions
  - Stores to Firebase Storage with public URL
  - Metadata saved to Firestore under `users/{uid}/uploads`
- **Frontend:** `ImageUpload.jsx` with preview and AI analysis display

### 3. **User Profile & Preferences**
- **Endpoints:**
  - `GET /api/user/profile` - Get user data with preferences
  - `POST /api/user/preferences` - Save preferences (colors, budget, style, bio)
  - `POST /api/user/saved-outfits` - Save favorite outfits
  - `GET /api/user/saved-outfits` - Retrieve saved outfits
- **Frontend:** `Profile.jsx` with preference form, color & style selectors
- **Firebase:** Stored in `users/{uid}` collection with sub-collection `savedOutfits`

### 4. **Enhanced UI/UX**
- **Auth Flow:** `Auth.jsx` - Firebase Auth signup/login with email/password
- **Navigation:** Tab-based navigation (Home, Upload, AI Pick, Profile)
- **Responsive Design:** Mobile-first Tailwind CSS with gradient backgrounds
- **Loading States:** Skeleton loaders for improved perceived performance
- **Error Handling:** Toast-like messages for feedback
- **Outfit Card Enhancements:** Save button, color display, styling details

---

## 🚀 Setup Instructions

### **Prerequisites**
- Node.js 16+
- Firebase project (with Firestore, Storage, Authentication enabled)
- Google Generative AI (Gemini) API key
- Git

### **Step 1: Firebase Setup**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create or select your project
3. Enable these services:
   - **Authentication** (Email/Password)
   - **Cloud Firestore** (Start in test mode for development)
   - **Storage** (Create a bucket)
4. Get your project config:
   - Click "Project Settings" → "Your Apps"
   - Copy the Firebase config object (contains apiKey, projectId, etc.)

### **Step 2: Get Gemini API Key**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and store securely

### **Step 3: Backend Setup**
```bash
cd backend
npm install

# Create .env from template
cp .env.example .env

# Edit .env with your values:
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key_here
PORT=4000
```

**If using Firebase service account (for production):**
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key (JSON)
3. Save as `backend/serviceAccount.json`
4. Or set `GOOGLE_APPLICATION_CREDENTIALS` env var

### **Step 4: Frontend Setup**
```bash
cd frontend
npm install

# Create .env from template
cp .env.example .env

# Edit .env with your Firebase config:
VITE_API_BASE_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### **Step 5: Local Development**
```bash
# Terminal 1: Start backend
cd backend
npm run dev
# Expected: "Dressify backend running on port 4000"

# Terminal 2: Start frontend
cd frontend
npm run dev
# Expected: "http://localhost:5173"
```

Navigate to `http://localhost:5173` and test:
- ✅ Sign up / Sign in
- ✅ View outfit filters
- ✅ Upload an image (will tag with AI)
- ✅ Get AI recommendations
- ✅ Edit profile preferences
- ✅ Save outfits

---

## 📦 Production Deployment

### **Option A: Firebase Hosting + Cloud Run**

#### Backend (Cloud Run)
```bash
cd backend

# Build Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/dressify-backend

# Deploy to Cloud Run
gcloud run deploy dressify-backend \
  --image gcr.io/YOUR_PROJECT_ID/dressify-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars GOOGLE_GENERATIVE_AI_API_KEY=your_key,FIREBASE_STORAGE_BUCKET=your-bucket

# Get the backend URL
gcloud run services describe dressify-backend --platform managed --region us-central1
```

#### Frontend (Firebase Hosting)
```bash
cd frontend

# Build
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### **Option B: Docker Compose (Self-hosted)**

Create `docker-compose.yml` in project root:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      FIREBASE_STORAGE_BUCKET: ${FIREBASE_STORAGE_BUCKET}
      GOOGLE_GENERATIVE_AI_API_KEY: ${GOOGLE_GENERATIVE_AI_API_KEY}
      PORT: 4000
      VITE_API_BASE_URL: http://localhost:5173
    volumes:
      - ./backend/serviceAccount.json:/app/serviceAccount.json:ro

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_BASE_URL: http://localhost:4000
      VITE_FIREBASE_API_KEY: ${VITE_FIREBASE_API_KEY}
      VITE_FIREBASE_AUTH_DOMAIN: ${VITE_FIREBASE_AUTH_DOMAIN}
      VITE_FIREBASE_PROJECT_ID: ${VITE_FIREBASE_PROJECT_ID}
      VITE_FIREBASE_STORAGE_BUCKET: ${VITE_FIREBASE_STORAGE_BUCKET}
      VITE_FIREBASE_MESSAGING_SENDER_ID: ${VITE_FIREBASE_MESSAGING_SENDER_ID}
      VITE_FIREBASE_APP_ID: ${VITE_FIREBASE_APP_ID}
```

Run:
```bash
docker-compose up
```

---

## 🔧 Configuration

### **Firebase Firestore Structure**
```
users/
  {uid}/
    preferences: { colors: [], budget, style: [], bio, ... }
    email: string
    updatedAt: timestamp
    uploads/
      {uploadId}
        publicUrl: string
        tags: { colors, style, season, gender, occasions, description }
        uploadedAt: timestamp
    savedOutfits/
      {saveId}
        outfitId: string
        savedAt: timestamp
```

### **Required Environment Variables**

**Backend (.env)**
```
PORT=4000
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccount.json
FIREBASE_STORAGE_BUCKET=dressify-prod.appspot.com
GOOGLE_GENERATIVE_AI_API_KEY=sk-...
VITE_API_BASE_URL=http://localhost:5173
```

**Frontend (.env)**
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

## 🧪 Testing

### **Backend API**
```bash
# Get recommendations
curl -X POST http://localhost:4000/api/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userPreferences":{}}'

# Upload image
curl -X POST http://localhost:4000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@outfit.jpg"

# Save preferences
curl -X POST http://localhost:4000/api/user/preferences \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"colors":["Red"],"budget":"mid-range"}'
```

### **Frontend Checklist**
- [ ] Sign up / Sign in works
- [ ] Profile page loads user data
- [ ] Image upload shows preview and AI tags
- [ ] AI recommendations return ranked outfits
- [ ] Save/unsave outfits from cards
- [ ] Filters work on home page
- [ ] Navigation between pages works
- [ ] Token persists on page refresh

---

## 🐛 Troubleshooting

### **CORS Error**
- Ensure `VITE_API_BASE_URL` in frontend matches backend URL
- Backend CORS is set to `http://localhost:5173` for dev

### **Firebase Auth Not Working**
- Check Firebase config in `.env` (frontend)
- Enable Email/Password in Firebase Console
- Ensure service account JSON is in correct path

### **Gemini API Errors**
- Verify API key is valid
- Check quota in Google Cloud Console
- API has rate limits (~60 requests/minute for free tier)

### **Image Upload Fails**
- Firebase Storage bucket must exist
- Service account must have Storage Editor role
- Image size < 10MB
- Supported formats: JPEG, PNG, WebP, GIF

### **Port Already in Use**
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or use different port
PORT=5000 npm start
```

---

## 📚 API Reference

### **Authentication**
All protected endpoints require: `Authorization: Bearer {idToken}`

### **Public Endpoints**
- `GET /api/outfits?country=&gender=&season=&festival=` - Browse outfits
- `GET /api/suggestions` - Get styling suggestions
- `GET /api/stores` - Get shopping recommendations

### **Protected Endpoints**
- `GET /api/user/profile` - Get user profile
- `POST /api/user/preferences` - Update preferences
- `POST /api/upload` - Upload outfit image
- `POST /api/recommendations` - Get AI recommendations
- `POST /api/user/saved-outfits` - Save outfit
- `GET /api/user/saved-outfits` - Get saved outfits

---

## 🎯 Next Steps (Optional Enhancements)

1. **Social Features:** Share outfits, follow users, comment
2. **Shopping Integration:** Link to actual shopping sites for purchases
3. **Advanced AI:** Use computer vision for style matching, body type recommendations
4. **Mobile App:** React Native version
5. **Analytics:** Track user behavior, trending outfits
6. **Payment:** Premium features (early access, exclusive collections)
7. **Email Notifications:** Weekly outfit suggestions

---

## 📞 Support

For issues or questions:
1. Check logs: `backend/` and `frontend/` console output
2. Review Firebase Console for errors
3. Test with curl before debugging frontend
4. Check `.env` files match your Firebase config

---

**Happy coding! 🎉**
