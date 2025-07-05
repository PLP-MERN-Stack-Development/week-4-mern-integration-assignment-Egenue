const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) throw new Error('No image uploaded');
    res.json({ url: `/uploads/${req.file.filename}` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;