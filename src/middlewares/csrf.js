const crypto = require('crypto');

// Pattern "synchronizer token" : un token lie a la session, exige sur
// toute requete qui modifie de l'etat (POST/PUT/DELETE)
function csrfProtection(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }

  const safeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  // /auth/login et /auth/register sont exemptes : avant connexion, il n'y a
  // pas encore de session utilisateur etablie a laquelle rattacher un token
  const exemptPaths = ['/auth/login', '/auth/register'];

  if (safeMethod || exemptPaths.includes(req.path)) {
    return next();
  }

  const tokenFromRequest = req.headers['x-csrf-token'];
  if (!tokenFromRequest || tokenFromRequest !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Token CSRF invalide' });
  }
  next();
}

module.exports = csrfProtection;
