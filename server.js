const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // serves static files (index.html, etc.)

// Configure uploads folder and Multer for avatar file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // prepend timestamp to filename for uniqueness
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'));
  }
});

// Avatar Sign-up/API endpoint
app.post('/signup', upload.single('avatar'), (req, res) => {
  const { displayName } = req.body;
  const avatar = req.file;

  if (!displayName || !avatar) {
    return res.status(400).json({ success: false, error: 'Both display name and avatar are required.' });
  }

  // For demonstration, return info back; in production, you'd save to DB, handle sessions, etc.
  res.json({
    success: true,
    message: 'User registered successfully!',
    user: {
      displayName,
      avatarUrl: `/uploads/${avatar.filename}`
    }
  });
});

// Serve HTML frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve uploaded avatars
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
