const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('../db/init');
const { loginLimiter } = require('../middlewares/rateLimiters');

const router = express.Router();

router.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Donnees invalides' });
    }
    const { email, password } = req.body;
    try {
      const password_hash = bcrypt.hashSync(password, 12);
      const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
      const result = stmt.run(email, password_hash);
      res.status(201).json({ id: result.lastInsertRowid, email });
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'Email deja utilise' });
      }
      next(err);
    }
  }
);

router.post('/login', loginLimiter,
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Donnees invalides' });
    }
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    req.session.userId = user.id;
    req.session.email = user.email;
    res.json({ message: 'Connecte' });
  }
);

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Deconnecte' });
  });
});

module.exports = router;
