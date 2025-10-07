const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp, cert, getApps } = require('firebase-admin/app');

function initializeFirestore() {
  if (getApps().length > 0) return getFirestore();

  const serviceAccount = JSON.parse(
    Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('ascii')
  );

  initializeApp({
    credential: cert(serviceAccount)
  });
  return getFirestore();
}

const db = initializeFirestore();

async function logQueryResponse(responseData) {
  if (!responseData?.id) return;
  try {
    const docRef = db.collection('query_responses').doc(responseData.id);
    await docRef.set(responseData);
    console.log(`[Firestore Logger] Successfully logged query ${responseData.id}`);
  } catch (error) {
    console.error('[Firestore Logger] Failed to log query response:', error);
  }
}

module.exports = { logQueryResponse };