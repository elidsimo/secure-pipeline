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