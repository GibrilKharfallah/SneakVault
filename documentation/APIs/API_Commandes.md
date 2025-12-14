# API Commandes

## Présentation

Cette API orchestre la création des commandes à partir du panier, le suivi des commandes d’un utilisateur et, côté back-office, la mise à jour de leur statut. Chaque commande agrège les items du panier, fige les prix et crée automatiquement une entrée de livraison, puis attend un paiement.

## Endpoints REST

| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| POST | `/api/orders` | JWT requis | Crée une commande depuis le panier courant. |
| GET | `/api/orders/me` | JWT requis | Retourne les commandes de l’utilisateur connecté. |
| GET | `/api/orders/:orderId` | JWT requis | Récupère une commande spécifique appartenant à l’utilisateur. |
| PUT | `/api/orders/:orderId/status` | JWT requis (ADMIN recommandé) | Met à jour le statut d’une commande. |

### Détails clés

#### POST `/api/orders`

- **Objectif** : transformer le panier en commande, décrémenter les stocks, créer la livraison.
- **Payload attendu** :

  ```json
  {
    "addressLine1": "12 rue des Sneakers",
    "addressLine2": "Bâtiment B",
    "city": "Paris",
    "postalCode": "75000",
    "country": "France"
  }
  ```

- **Réponse** (`201`) :

  ```json
  {
    "message": "Commande créée avec succès.",
    "order": { "_id": "...", "items": [...], "totalAmount": 299.8, "status": "PENDING" },
    "delivery": { "_id": "...", "trackingNumber": "TRK-..." }
  }
  ```

- **Erreurs** : `400` si panier vide ou stock insuffisant sur un des produits.

#### GET `/api/orders/me`

- **Objectif** : historique client.
- **Réponse** : liste ordonnée par `createdAt` descendant, avec items (`product`, `quantity`, `unitPrice`) et `status`.

#### GET `/api/orders/:orderId`

- **Objectif** : détail d’une commande (page `/orders` ou support client).
- **Sécurité** : la commande doit appartenir à l’utilisateur sinon `404`.

#### PUT `/api/orders/:orderId/status`

- **Objectif** : utilisé par l’administration pour faire évoluer le statut (`PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- **Payload** : `{ "status": "SHIPPED" }`.
- **Réponse** : commande mise à jour ou `404`.

## Notes techniques

- `POST /api/orders` vide automatiquement le panier (`Cart`) et décrémente `product.stock`.
- Lorsqu’un paiement aboutit (`POST /api/payments`), la commande passe en `PAID`.
- La création de commande génère une livraison (`Delivery`) avec numéro de suivi `TRK-<timestamp>`.
- Les routes admin duplicatives existent (`/api/admin/orders`) pour des besoins plus complets (liste globale, patch).

Ici, l’API Commandes côté « client » reste centrée sur l’utilisateur connecté.
