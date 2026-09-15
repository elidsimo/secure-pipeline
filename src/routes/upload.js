const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // On ignore totalement le nom original du fichier envoye par le client
    // (jamais fiable) et on genere un nom aleatoire pour eviter path traversal
    // et collisions
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = crypto.randomBytes(16).toString('hex') + ext;
    cb(null, safeName);
  },
});

const allowedTypes = ['image/jpeg', 'image/png'];

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 Mo max
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Type de fichier non autorise'));
    }
    cb(null, true);
  },
});

router.post('/profile-picture', requireAuth, upload.single('picture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier valide recu' });
  }
  res.json({ filename: req.file.filename });
});

module.exports = router;
