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

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Assign role to user route
app.post('/assign-role', async (req, res) => {
  try {
    const { uid, role } = req.body;

    if (!uid || !role) {
      return res.status(400).json({ error: 'Missing uid or role.' });
    }

    // Set custom claims on the user
    await admin.auth().setCustomUserClaims(uid, { role });

    // Optional: Update role in the Realtime Database
    await admin.database().ref(`/accounts/${uid}`).update({ role });

    res.status(200).json({ message: `Successfully assigned role ${role} to user ${uid}` });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ error: 'Error assigning role.' });
  }
});

// Token refresh route
app.post('/refresh-token', async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'Missing uid.' });
    }

    const user = await admin.auth().getUser(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Invalidate the current token to force refresh
    await admin.auth().revokeRefreshTokens(uid);

    res.status(200).json({ message: 'Token refresh initiated.' });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Error refreshing token.' });
  }
});

// Health check endpoint (optional)
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running and healthy.' });
});
