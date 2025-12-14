# API Utilisateurs

## Présentation

API dédiée au profil de l’utilisateur connecté. Elle permet de consulter ses informations personnelles (hors mot de passe), de mettre à jour son nom/prénom et de supprimer son compte. Les opérations d’administration (liste des utilisateurs, changement de rôle) sont couvertes par l’API Admin et ne sont pas détaillées ici.

## Endpoints REST

| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| GET | `/api/users/me` | JWT requis | Retourne le profil de l’utilisateur courant. |
| PUT | `/api/users/me` | JWT requis | Met à jour le profil (prénom/nom). |
| DELETE | `/api/users/me` | JWT requis | Supprime le compte de l’utilisateur. |

### Détails clés

#### GET `/api/users/me`

- **Réponse** :

  ```json
  {
    "_id": "...",
    "email": "client@client.fr",
    "firstName": "Alex",
    "lastName": "Doe",
    "role": "USER",
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```

- Le champ `passwordHash` est exclu (`select('-passwordHash')`).

#### PUT `/api/users/me`

- **Payload** :

  ```json
  { "firstName": "Alexis", "lastName": "Dupont" }
  ```

- **Réponse** : profil mis à jour.
- **Erreurs** : `404` si l’utilisateur n’existe plus (ex. suppression concurrente).

#### DELETE `/api/users/me`

- **Objectif** : droit à l’oubli.
- **Réponse** :

  ```json
  { "message": "Compte supprimé avec succès" }
  ```

## Notes techniques

- Les mots de passe sont stockés hachés (`bcryptjs`) lors de l’inscription/connexion (cf. API Auth).
- Les données supplémentaires (adresse, préférences) sont gérées via d’autres collections (panier, commandes) et non directement via le profil.
- Après suppression, les données dépendantes (commandes, avis) ne sont pas cascades automatiquement : prévoir une politique de purge si nécessaire.
