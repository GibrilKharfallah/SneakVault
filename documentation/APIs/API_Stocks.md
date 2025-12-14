# API Stocks

## Présentation

API critique destinée à suivre la disponibilité des produits. Elle est exposée à la fois en REST (utilisée par l’administration et certains écrans front) et en GraphQL pour des intégrations plus fines. Le stock est stocké directement sur le document `Product` via le champ `stock` (ou `stockQuantity` côté GraphQL).

## Endpoints REST

| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| GET | `/api/stocks/:productId` | Aucune | Retourne la quantité en stock pour un produit. |
| PUT | `/api/stocks/:productId` | JWT requis + ADMIN | Met à jour la quantité. |

### Détails clés

#### GET `/api/stocks/:productId`

- **Objectif** : consultation rapide depuis le front (recommandations, pages produit, etc.).
- **Réponse** :

  ```json
  {
    "productId": "<ObjectId>",
    "stock": 25
  }
  ```

- **Erreurs** : `404` si produit introuvable.

#### PUT `/api/stocks/:productId`

- **Auth** : `authRequired` + `validateBody(['quantity'])` + logique métier `requireRole('ADMIN')` dans certaines couches.
- **Payload** :

  ```json
  { "quantity": 50 }
  ```

- **Réponse** : `{ "productId": "...", "stock": 50 }`.
- **Erreurs** : `400` si `quantity` n’est pas un nombre, `404` si produit inexistant.

## GraphQL

- **Query `stock(productId: ID!)`** → renvoie `{ productId, quantity, updatedAt }`.
- **Mutation `updateStock(productId: ID!, quantity: Int!)`** → protégée par `requireRole('ADMIN')`.

## Notes techniques

- Les stocks sont décrémentés automatiquement lors de `POST /api/orders` (création de commande). Assurez-vous qu’aucune mise à jour concurrente ne repasse le stock à un niveau erroné.
- Les contrôleurs REST utilisent `Product.findByIdAndUpdate` avec `{ new: true }` pour renvoyer la valeur après mise à jour.
- Prévoir un mécanisme de seuil pour déclencher des alertes (exemple : `lowStockProducts` exposé via `/api/admin/stats`).
