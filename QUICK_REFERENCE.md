# 🚀 Dressify - Quick Reference Guide

## ⚡ Start the Application (30 seconds)

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Then open browser:
# http://localhost:5173
```

---

## 📍 Server Locations

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 | ✅ Running |
| Backend API | http://localhost:4000 | ✅ Running |
| API Docs | http://localhost:4000/api | See endpoints |

---

## 🛠️ Common Commands

### Backend
```bash
cd backend

npm install          # Install dependencies
npm run dev         # Start dev server with auto-reload
npm run start       # Start production server
npm run seed        # Seed Firestore with sample data
```

### Frontend
```bash
cd frontend

npm install         # Install dependencies
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## 🎯 Application Features

### Filter Options
- **Country**: India, USA, UK, Canada
- **Gender**: Female, Male, Unisex
- **Season**: Summer, Winter, Spring, Fall
- **Occasion**: Diwali, Wedding, Casual, Christmas, Eid, Holi

### Outfit Card Actions
- Click "View Styling Details" to expand
- See Accessories recommendations
- See Makeup suggestions
- See Hairstyle recommendations

---

## 🔌 API Endpoints

### Outfits
```bash
GET http://localhost:4000/api/outfits
GET http://localhost:4000/api/outfits?country=India&gender=female
GET http://localhost:4000/api/outfits?season=summer&festival=diwali
```

### Suggestions
```bash
GET http://localhost:4000/api/suggestions
```

### Stores
```bash
GET http://localhost:4000/api/stores
```

### User Preferences (Auth Required)
```bash
POST http://localhost:4000/api/user/preferences
Content-Type: application/json

{
  "favoriteCountry": "India",
  "preferredGender": "female"
}
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4000
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Or use different port
PORT=5000 npm run dev
```

### Dependencies Issues
```bash
# Clear and reinstall
rm -r node_modules package-lock.json
npm install
```

### Can't Connect Backend & Frontend
```bash
# Check .env file
cat frontend/.env
# Should have: VITE_API_BASE_URL=http://localhost:4000

# Ensure both servers running
# Backend: http://localhost:4000
# Frontend: http://localhost:5173
```

---

## 📝 Configuration Files

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

---

## 🔐 Firebase Setup (Optional)

To use real database instead of sample data:

1. Create project: https://console.firebase.google.com
2. Download service account JSON
3. Save as: `backend/serviceAccount.json`
4. Run: `cd backend && npm run seed`
5. Restart backend

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| backend/server.js | API server |
| frontend/src/App.jsx | Main app component |
| frontend/src/components/Filters.jsx | Filter dropdown |
| frontend/src/components/OutfitCard.jsx | Outfit display |
| SETUP_GUIDE.md | Detailed setup |
| COMPLETION_SUMMARY.md | Implementation details |

---

## 🎨 Technology Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Firebase
- **Database**: Firestore (optional)
- **Styling**: Tailwind CSS + PostCSS

---

## ✅ Verification Checklist

- [ ] Backend running on localhost:4000
- [ ] Frontend running on localhost:5173
- [ ] Can see outfit list
- [ ] Filters are working
- [ ] Can view styling details
- [ ] No console errors

---

## 🚀 Production Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Push to GitHub and connect to Vercel
```

### Backend (Render/Railway)
```bash
# Set environment variable: FIREBASE_SERVICE_ACCOUNT_PATH
npm run start
```

---

## 💡 Tips

- Use sample data for development (no Firebase needed)
- Add Firebase credentials when ready for production
- Check browser console for any API errors
- Check backend console for server logs

---

## 📞 Need Help?

1. **Check SETUP_GUIDE.md** for detailed instructions
2. **Check COMPLETION_SUMMARY.md** for implementation details
3. **See troubleshooting section** above
4. **Check server logs** in terminal

---

**Last Updated**: December 25, 2025
**Status**: ✅ Ready to Use
