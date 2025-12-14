# API Avis

## Présentation

Cette API permet aux clients de consulter les avis d’un produit, d’en ajouter après achat et de supprimer leurs propres avis (ou de laisser la modération admin intervenir). Les données sont stockées dans la collection `Review` avec `product`, `user`, `rating`, `comment`, `createdAt`.

## Endpoints REST

| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| GET | `/api/reviews/product/:productId` | Aucune | Liste des avis d’un produit. |
| POST | `/api/reviews/product/:productId` | JWT requis | Ajoute un avis (note + commentaire). |
| DELETE | `/api/reviews/:id` | JWT requis | Supprime un avis (auteur ou ADMIN). |

### Détails clés

#### GET `/api/reviews/product/:productId`

- **Objectif** : afficher les retours clients sur la fiche produit.
- **Réponse** : tableau trié par `createdAt` décroissant.

#### POST `/api/reviews/product/:productId`

- **Auth** : token requis.
- **Validation** : `rating` et `comment` obligatoires (`validateBody`).
- **Payload** :

  ```json
  {
    "rating": 4,
    "comment": "Super confortable"
  }
  ```

- **Réponse** : avis créé avec `_id`, `user`, timestamps.

#### DELETE `/api/reviews/:id`

- **Règles** :
  - Si `req.user.role === 'ADMIN'`, suppression inconditionnelle.
  - Sinon, seul l’auteur (`user: req.user.id`) peut supprimer.
- **Réponse** : `204 No Content` ou `404` si avis introuvable.

## GraphQL

SDL (`review.graphql`) expose :

- **Query `reviews(productId: ID!)`** pour récupérer les avis d’un produit.
- **Mutation `addReview(input)`** (auth requise).
- **Mutation `deleteReview(id)`** (auth requise, contrôle identique au REST).

## Notes techniques

- L’API ne vérifie pas encore qu’un utilisateur a acheté le produit avant de laisser un avis (possible amélioration).
- Le front convertit la note en étoiles et affiche l’email du user s’il est disponible.
- Prévoir une sanitation côté front/back pour éviter les contenus abusifs (actuellement non implémenté).
