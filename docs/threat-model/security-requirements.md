# Security Requirements — Checkout Flow

Ces exigences sont dérivées directement du threat model. Elles deviendront des critères
d'acceptation pour les prochaines fonctionnalités (Guide 4 : Secure Application Implementation).

| ID | Exigence | Origine (menace liée) |
|---|---|---|
| SR-001 | Toutes les requêtes SQL doivent utiliser des requêtes paramétrées, jamais de concaténation de chaînes | AC-002 |
| SR-002 | Toute route accédant à une ressource par ID doit vérifier que l'utilisateur authentifié est bien propriétaire de la ressource | AC-001 |
| SR-003 | Aucune donnée de carte bancaire (même partielle) ne doit apparaître dans les logs applicatifs | AC-003 |
| SR-004 | Toutes les communications doivent forcer HTTPS (HSTS activé en production) | Menace Information Disclosure sur HTTPS Request |
| SR-005 | Toutes les entrées utilisateur doivent être validées côté serveur selon une liste blanche (allowlist) | AC-002 |

| ID | Exigence | Origine | Statut |
|---|---|---|---|
| SR-001 | Requetes parametrees | AC-002 | ✅ Mitigee — `src/db/init.js`, toutes les requetes `better-sqlite3` |
| SR-002 | Verification de propriete | AC-001 | ✅ Mitigee — `src/routes/orders.js`, verification `order.user_id` |
| SR-003 | Pas de donnees sensibles en logs | AC-003 | ✅ Mitigee — `src/routes/orders.js`, `src/middlewares/errorHandler.js` |
| SR-004 | HTTPS / headers de securite | Menace Information Disclosure | ✅ Mitigee — `helmet` dans `src/app.js` |
| SR-005 | Validation allowlist | AC-002 | ✅ Mitigee — `express-validator` sur toutes les routes |
