# Dressify - Fashion Guidance Web Application

A full-stack web app providing personalized fashion recommendations based on country, gender, season, and occasion.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Firebase Admin SDK
- **Database**: Firestore
- **Auth**: Firebase Authentication (Google Sign-In)
- **Hosting**: Firebase Hosting (frontend)

## Project Structure

```
DRESSIFY/
├── backend/
│   ├── server.js              # Express server with API endpoints
│   ├── package.json
│   ├── scripts/
│   │   └── seedFirestore.js   # Seed sample data
│   ├── lib/
│   │   └── firebase.js        # Firebase initialization
│   └── serviceAccount.json    # Firebase credentials (create this)
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── Filters.jsx
│   │       └── OutfitCard.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   └── vite.config.js
├── .firebaserc
├── firebase.json
└── .gitignore
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm/yarn
- Firebase project (create at [console.firebase.google.com](https://console.firebase.google.com))
- Firebase service account JSON key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add Firebase credentials:
   - Download your service account JSON from Firebase Console
   - Place it at `backend/serviceAccount.json` or set `FIREBASE_SERVICE_ACCOUNT_PATH` env var
   - Alternatively, set `GOOGLE_APPLICATION_CREDENTIALS` environment variable

4. Seed Firestore with sample data:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`

## API Endpoints

### Public Endpoints

- `GET /api/outfits?country=India&gender=female&season=summer&festival=diwali`
  - Returns outfit recommendations
  - Query params are optional

- `GET /api/suggestions`
  - Returns styling suggestions (accessories, makeup, hairstyle)

- `GET /api/stores`
  - Returns store availability for purchasing outfits

### Protected Endpoints (require Firebase ID token)

- `POST /api/user/preferences`
  - Save user styling preferences
  - Header: `Authorization: Bearer <idToken>`
  - Body: `{ country, gender, season, festival }`

## Features

- **Dynamic Filtering**: Filter by country, gender, season, and festival/occasion
- **Outfit Recommendations**: Contextual outfit suggestions
- **Styling Details**: Accessories, makeup, and hairstyle recommendations
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Firebase Integration**: Auth and Firestore for data persistence
- **Sample Data**: Pre-populated with demo outfits

## Environment Variables

### Backend

```env
PORT=4000
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccount.json
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json (alternative)
```

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase project:
   ```bash
   firebase init
   ```

4. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```

5. Deploy:
   ```bash
   firebase deploy
   ```

### Backend Deployment

Deploy to Firebase Cloud Functions, Google Cloud Run, or Heroku:

```bash
# For Cloud Run
gcloud run deploy dressify-backend --source .
```

## Testing Locally

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open `http://localhost:5173` in your browser
4. Use the filters to see outfit recommendations

## Next Steps / TODOs

- [ ] Wire Firebase Authentication (Google Sign-In) to frontend
- [ ] Create user account pages
- [ ] Add more outfit and styling data to Firestore
- [ ] Implement store integrations
- [ ] Add image uploads for outfits
- [ ] Create admin dashboard for managing outfits
- [ ] Add search and advanced filtering
- [ ] Deploy to Firebase Hosting

## License

MIT
