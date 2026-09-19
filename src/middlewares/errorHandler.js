function errorHandler(err, req, res, next) {
  // Log detaille pour toi (jamais envoye au client)
  console.error(`[${new Date().toISOString()}] ERROR:`, err.message);

  // Reponse generique pour l'utilisateur (ne jamais exposer la stack trace
  // ou les details internes, qui pourraient aider un attaquant)
  res.status(500).json({ error: 'Une erreur interne est survenue' });
}

module.exports = errorHandler;
