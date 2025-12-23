const admin = require('firebase-admin');
const path = require('path');

module.exports = {
  getDb: () => {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, '..', 'serviceAccount.json');
    if (!admin.apps.length) {
      try {
        admin.initializeApp({ credential: admin.credential.cert(require(serviceAccountPath)) });
      } catch (e) {
        console.warn('Firebase not initialized');
      }
    }
    return admin.firestore && admin.firestore();
  }
};
