const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, '..', 'serviceAccount.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account JSON not found at', serviceAccountPath);
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(require(serviceAccountPath)) });
const db = admin.firestore();

async function seed() {
  const outfits = [
    { title: 'Light Kurta Set', country: 'India', gender: 'female', season: 'summer', festival: 'diwali', description: 'Breathable cotton kurta with dupatta.' },
    { title: 'Silk Saree', country: 'India', gender: 'female', season: 'winter', festival: 'wedding', description: 'Rich silk with zardosi work.' },
    { title: 'Blazer & Chinos', country: 'USA', gender: 'male', season: 'fall', festival: 'casual', description: 'Smart casual for evenings.' }
  ];

  const suggestions = [
    { outfitTitle: 'Light Kurta Set', accessories: ['jhumkas','mojris'], makeup: 'natural with kohl', hairstyle: 'braided bun' },
    { outfitTitle: 'Blazer & Chinos', accessories: ['leather watch'], makeup: 'n/a', hairstyle: 'neat side part' }
  ];

  for (const o of outfits) {
    await db.collection('outfits').add(o);
  }
  for (const s of suggestions) {
    await db.collection('suggestions').add(s);
  }
  console.log('Seed complete');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
