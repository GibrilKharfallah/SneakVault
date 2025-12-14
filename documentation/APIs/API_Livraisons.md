# API Livraisons

## Présentation

Cette API suit l’acheminement des commandes une fois créées. Chaque livraison est liée à une commande et à un utilisateur, conserve le statut (`PENDING`, `SHIPPED`, `DELIVERED`, etc.) et un numéro de suivi (`trackingNumber`). Les mises à jour peuvent déclencher l’envoi d’emails via le service dédié.

## Endpoints REST

| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| GET | `/api/deliveries/order/:orderId` | JWT requis | Retourne la livraison associée à la commande fournie. |
| PATCH | `/api/deliveries/:id/status` | JWT requis (ADMIN conseillé) | Met à jour le statut et/ou le numéro de suivi. |

### Détails clés

#### GET `/api/deliveries/order/:orderId`

- **Objectif** : afficher dans l’espace client le suivi de la commande.
- **Réponse** :

  ```json
  {
    "_id": "...",
    "order": "<orderId>",
    "status": "PENDING",
    "trackingNumber": "TRK-...",
    "addressLine1": "...",
    "city": "...",
    "postalCode": "...",
    "updatedAt": "..."
  }
  ```

- **Erreurs** : `404` si aucune livraison n’est liée à l’ordre.

#### PATCH `/api/deliveries/:id/status`

- **Objectif** : mis à jour par un opérateur ou un batch automatique.
- **Payload** (optionnel selon champ) :

  ```json
  {
    "status": "SHIPPED",
    "trackingNumber": "COLISSIMO123456"
  }
  ```

- **Réponse** : livraison mise à jour.

## Notes techniques

- Les livraisons sont créées automatiquement lors du `POST /api/orders`.
- Après mise à jour, un email fictif peut être envoyé via `sendDeliveryStatusEmail`.
- Les endpoints sont protégés par `authRequired`. Pour des cas réels, restreindre encore plus (ADMIN uniquement) via `requireRole`.
