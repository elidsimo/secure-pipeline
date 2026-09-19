const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db/init');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

// Creer une commande (simule un checkout)
router.post('/', requireAuth,
  body('item').trim().isLength({ min: 1, max: 200 }).escape(),
  body('amount').isFloat({ min: 0.01, max: 100000 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Donnees de commande invalides' });
    }
    const { item, amount } = req.body;
    const stmt = db.prepare('INSERT INTO orders (user_id, item, amount) VALUES (?, ?, ?)');
    const result = stmt.run(req.session.userId, item, amount);

    // SR-003 : ne jamais logger req.body brut sur une route liee au paiement.
    // On logge uniquement des identifiants, jamais le detail de la transaction.
    console.log(`[ORDER] user=${req.session.userId} order=${result.lastInsertRowid}`);

    res.status(201).json({ id: result.lastInsertRowid, item, amount });
  }
);

// Consulter une commande : protection IDOR
router.get('/:id', requireAuth, (req, res) => {
  const orderId = Number(req.params.id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({ error: 'ID invalide' });
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Commande introuvable' });
  }

  // Verification d'appartenance (SR-002) : meme si la commande existe,
  // seul son proprietaire peut la consulter
  if (order.user_id !== req.session.userId) {
    return res.status(403).json({ error: 'Acces refuse' });
  }

  res.json(order);
});

module.exports = router;
