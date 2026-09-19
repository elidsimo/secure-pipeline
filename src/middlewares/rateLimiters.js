const rateLimit = require('express-rate-limit');

// Limite les tentatives de connexion pour contrer le brute-force,
// sans penaliser un utilisateur qui se connecte legitimement plusieurs fois
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Trop de tentatives, reessayez plus tard' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter };
