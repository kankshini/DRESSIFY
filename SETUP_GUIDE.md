# Dressify - Complete Setup & Testing Guide

## Project Overview
Dressify is a full-stack fashion recommendation web application providing personalized outfit suggestions based on country, gender, season, and occasion.

## ✅ Setup Status

### Completed
- ✅ Backend server with Express.js
- ✅ Frontend React application with Vite
- ✅ All component files (Filters, OutfitCard)
- ✅ API integration with axios
- ✅ Environment configuration (.env files created)
- ✅ Dependencies installed (npm install completed)
- ✅ Tailwind CSS styling configured
- ✅ API endpoints with sample data fallback

## 🚀 Quick Start

### Prerequisites
1. **Node.js** (v16+) - [Download](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **Firebase Project** (optional, for Firestore)
   - Create at [console.firebase.google.com](https://console.firebase.google.com)
   - Download service account JSON and place at `backend/serviceAccount.json`

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Configure Firebase (optional but recommended):
   - Download service account JSON from Firebase Console
   - Place it at `backend/serviceAccount.json`
   - Or set environment variable: `GOOGLE_APPLICATION_CREDENTIALS`

3. Start development server:
   ```bash
   npm run dev
   ```
   - Server runs on `http://localhost:4000`
   - If Firebase not configured, uses sample data

4. (Optional) Seed Firestore with data:
   ```bash
   npm run seed
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Start development server:
   ```bash
   npm run dev
   ```
   - App runs on `http://localhost:5173`
   - Ensure backend is running on `http://localhost:4000`

## 📡 API Endpoints

### GET /api/outfits
Returns outfit recommendations based on filters.
**Query Parameters:**
- `country` (optional): e.g., "India", "USA"
- `gender` (optional): "female", "male", "unisex"
- `season` (optional): "summer", "winter", "spring", "fall"
- `festival` (optional): "diwali", "wedding", "casual", etc.

**Example:**
```bash
curl "http://localhost:4000/api/outfits?country=India&gender=female&season=summer"
```

### GET /api/suggestions
Returns styling suggestions (accessories, makeup, hairstyle).

### GET /api/stores
Returns store recommendations.

### POST /api/user/preferences (Requires Authentication)
Save user preferences.
**Body:**
```json
{
  "favoriteCountry": "India",
  "preferredGender": "female",
  "likedSeasons": ["summer", "winter"]
}
```

## 🎨 Frontend Features

- **Filter System**: Filter outfits by country, gender, season, and occasion
- **Outfit Cards**: Display outfit details with styling suggestions
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Loading States**: Shows loading indicator while fetching data
- **Error Handling**: Graceful fallback to sample data

## 🔧 Environment Variables

### Backend (.env)
```
PORT=4000
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccount.json
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:4000
```

## 📦 Project Structure

```
DRESSIFY/
├── backend/
│   ├── server.js                    # Express server & API routes
│   ├── lib/firebase.js              # Firebase initialization
│   ├── scripts/seedFirestore.js     # Database seeding
│   ├── package.json
│   ├── .env                         # Environment variables
│   └── serviceAccount.json          # Firebase credentials (create this)
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   ├── index.css                # Tailwind CSS
│   │   └── components/
│   │       ├── Filters.jsx          # Filter selection component
│   │       └── OutfitCard.jsx       # Outfit display component
│   ├── index.html                   # HTML template
│   ├── package.json
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.cjs          # Tailwind CSS config
│   └── .env                         # Environment variables
├── .gitignore
├── firebase.json                    # Firebase config
└── README.md                        # Documentation
```

## 🧪 Testing the Application

### Test Without Firebase (Using Sample Data)
1. **Start Backend** (without serviceAccount.json):
   ```bash
   cd backend && npm run dev
   ```
   - Server will use sample data automatically

2. **Start Frontend** (in new terminal):
   ```bash
   cd frontend && npm run dev
   ```

3. **Test in Browser**:
   - Open `http://localhost:5173`
   - Try filtering by different options
   - Click "View Styling Details" to see suggestions

### Test With Firebase (Recommended)
1. Create Firebase project and download service account JSON
2. Place `serviceAccount.json` in `backend/` directory
3. Follow "Backend Setup" above
4. Run: `npm run seed` to populate database
5. Continue with frontend setup

## 🐛 Troubleshooting

### Backend Issues
- **Port 4000 already in use**: 
  ```bash
  PORT=5000 npm run dev
  ```
- **Firebase not found**: 
  ```bash
  set GOOGLE_APPLICATION_CREDENTIALS=path\to\serviceAccount.json
  npm run dev
  ```

### Frontend Issues
- **Can't connect to backend**: 
  - Check `VITE_API_BASE_URL` in `.env`
  - Ensure backend is running
  - Check CORS is enabled in backend

- **Styles not loading**: 
  ```bash
  npm run build
  npm run preview
  ```

## 🚀 Deployment

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build frontend: `cd frontend && npm run build`
5. Deploy: `firebase deploy`

### Vercel (Recommended for Frontend)
1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variable: `VITE_API_BASE_URL`
4. Deploy automatically

## 📝 Development Notes

### Adding New Outfits
Edit `backend/scripts/seedFirestore.js` or add via API.

### Customizing Filters
Edit filter options in `frontend/src/components/Filters.jsx`:
```javascript
const countries = ['', 'India', 'USA', 'UK', 'Canada']
const genders = ['', 'female', 'male', 'unisex']
const seasons = ['', 'summer', 'winter', 'spring', 'fall']
const festivals = ['', 'diwali', 'wedding', 'casual', 'christmas', 'eid', 'holi']
```

### API Response Format
All API responses follow this format:
```json
{
  "data": [
    {
      "id": "unique_id",
      "title": "Outfit Name",
      "country": "India",
      "gender": "female",
      "season": "summer",
      "festival": "diwali",
      "description": "Description text"
    }
  ]
}
```

## ✨ Key Features Implemented

1. **Responsive Grid Layout** - Auto-adjusts from 1 to 3 columns
2. **Real-time Filtering** - Updates results as filters change
3. **Expandable Cards** - View detailed styling suggestions
4. **Gradient Background** - Beautiful pink-to-purple gradient
5. **Loading States** - User feedback during data fetching
6. **Empty States** - Helpful message when no results found
7. **Error Handling** - Graceful fallbacks and console logs

## 📚 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express, Joi validation |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Hosting | Firebase Hosting (frontend) |

## 🎯 Next Steps

1. ✅ Verify backend is running
2. ✅ Verify frontend is running
3. ✅ Test all filter combinations
4. ✅ Set up Firebase credentials (optional)
5. ✅ Deploy to production

---

**Ready to test?** Start with the "Quick Start" section above!
