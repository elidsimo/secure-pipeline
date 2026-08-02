# Abuse Cases — Checkout Flow

Format : "En tant qu'attaquant, je veux [action], afin de [objectif malveillant]"

## AC-001 — IDOR sur les commandes
**En tant qu'attaquant**, je veux modifier le paramètre `order_id` dans l'URL de consultation de commande,
**afin de** consulter ou modifier les commandes d'autres utilisateurs sans autorisation.

- Lié à : Menace STRIDE "Manipulation de l'order_id"
- Sévérité estimée : Élevée
- Test de validation prévu : voir Étape 6 (Attack Scenarios) du projet

## AC-002 — Injection SQL via le formulaire de connexion
**En tant qu'attaquant**, je veux injecter du code SQL dans le champ email/mot de passe,
**afin de** contourner l'authentification ou extraire la base de données utilisateurs.

- Lié à : Menace STRIDE "Injection SQL"
- Sévérité estimée : Critique
- Test de validation prévu : voir Étape 6

## AC-003 — Interception de données de paiement
**En tant qu'attaquant**, je veux accéder aux logs applicatifs du serveur,
**afin de** récupérer des numéros de carte bancaire potentiellement loggés en clair.

- Lié à : Menace STRIDE "Fuite de données de carte bancaire"
- Sévérité estimée : Critique
- Test de validation prévu : audit manuel des logs (Guide 6)