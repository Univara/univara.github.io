const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Get all blog posts
app.get('/api/blog-posts', async (req, res) => {
  try {
    const posts = [];
    const snapshot = await db.collection('blogPosts').get();
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).send('Error fetching posts');
  }
});

// Add a new blog post
app.post('/api/blog-posts', async (req, res) => {
  try {
    const newPost = req.body;
    const result = await db.collection('blogPosts').add(newPost);
    res.status(201).json({ id: result.id, ...newPost });
  } catch (error) {
    res.status(500).send('Error adding post');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
