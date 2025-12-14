# API Produits

## Présentation

API responsable du catalogue sneakers. Elle expose les opérations pour consulter la liste, récupérer une fiche produit, ainsi que créer, modifier ou supprimer un produit côté back-office. Les produits sont stockés dans MongoDB et portent des attributs comme `name`, `brand`, `category`, `description`, `price`, `image`, `stock`, `isActive`.

## Endpoints REST

| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| GET | `/api/products` | Aucune | Liste tous les produits actifs. |
| GET | `/api/products/:id` | Aucune | Retourne les détails d’un produit. |
| POST | `/api/products` | JWT requis | Crée un nouveau produit (réservé staff/admin). |
| PUT | `/api/products/:id` | JWT requis | Met à jour les champs d’un produit. |
| DELETE | `/api/products/:id` | JWT requis | Supprime/désactive un produit. |

### Détails clés

#### GET `/api/products`

- **Objectif** : afficher le catalogue sur la page d’accueil ou `/products`.
- **Réponse** : tableau d’objets `{ _id, name, brand, category, price, image, stock, isActive, ... }`.

#### GET `/api/products/:id`

- **Objectif** : alimenter la fiche produit, récupérer stock et description.
- **Réponse** : objet produit complet ou `404` si l’identifiant est inconnu.

#### POST `/api/products`

- **Auth** : `Authorization: Bearer <token>` (un rôle staff/ADMIN est attendu dans la pratique).
- **Payload minimal** :

  ```json
  {
    "name": "Aero Runner",
    "brand": "SneakerLab",
    "category": "running",
    "description": "Baskets légères",
    "price": 149.9,
    "image": "https://...",
    "stock": 20,
    "isActive": true
  }
  ```

- **Réponse** : produit créé (`201`) avec ses métadonnées MongoDB.

#### PUT `/api/products/:id`

- **Objectif** : modifier prix, stock, activation, etc.
- **Payload** : tout sous-ensemble des champs produit.
- **Réponse** : produit mis à jour (`200`) ou `404`.

#### DELETE `/api/products/:id`

- **Objectif** : retirer un produit du catalogue (suppression logique ou physique selon contrôleur).
- **Réponse** : `204 No Content` en cas de succès.

## Notes techniques

- Validation côté contrôleur : s’assure que `name` et `price` sont fournis lors de la création.
- Le champ `stock` est décrémenté lors de `POST /api/orders` (création de commande).
- Dans l’espace admin, les mêmes routes sont consommées via les pages `AdminProducts`.
- Swagger documente automatiquement ces endpoints (cf. annotations dans `backend/routes/product.routes.js`).
