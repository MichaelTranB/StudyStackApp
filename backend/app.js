const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://bookings-abeec.firebaseio.com',
});

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // To parse JSON request bodies

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Assign role to user
app.post('/assign-role', async (req, res) => {
  const { uid, role } = req.body; // Get uid and role from request body

  if (!uid || !role) {
    return res.status(400).json({ error: 'Missing uid or role' });
  }

  try {
    // Set custom claims on the user
    await admin.auth().setCustomUserClaims(uid, { role });
    
    // Optional: Update role in Realtime Database
    await admin.database().ref(`/accounts/${uid}`).update({ role });

    res.status(200).json({ message: `Successfully assigned role ${role} to user ${uid}` });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ error: 'Error assigning role' });
  }
});

// Token refresh route (optional)
app.post('/refresh-token', async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'Missing uid' });
  }

  try {
    const user = await admin.auth().getUser(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Force token refresh by invalidating the current token
    await admin.auth().revokeRefreshTokens(uid);
    
    res.status(200).json({ message: 'Token refresh initiated' });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Error refreshing token' });
  }
});

