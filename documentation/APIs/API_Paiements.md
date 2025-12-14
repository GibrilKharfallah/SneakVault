# API Paiements

## Présentation

Module prioritaire du projet : il simule l’intégration à un prestataire (Stripe, Adyen…). Lorsqu’une commande est créée, le front appelle cette API pour générer un paiement, lancer le traitement mocké, mettre à jour le statut de la commande et envoyer un email de confirmation. Elle expose également la consultation des paiements d’un client et la lecture détaillée d’un paiement spécifique.

## Endpoints REST

| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| POST | `/api/payments` | JWT requis + rate limit | Crée un paiement pour une commande donnée. |
| GET | `/api/payments/me` | JWT requis | Liste des paiements appartenant à l’utilisateur connecté. |
| GET | `/api/payments/:id` | JWT requis | Détail d’un paiement (contrôle d’accès : propriétaire ou ADMIN). |

### Détails clés

#### POST `/api/payments`

- **Rate limiting** : 10 requêtes / minute / IP via `paymentRateLimit`.
- **Payload** :

  ```json
  {
    "orderId": "<ObjectId de la commande>",
    "method": "CARD",
    "amount": 299.8
  }
  ```

- **Processus** :
  1. Vérifie que la commande existe et appartient à l’utilisateur (ou role ADMIN).
  2. Crée un paiement en base (`status: PENDING`).
  3. Appelle `processPaymentMock` (attend 200 ms et renvoie `{ success: true, transactionRef }`).
  4. Met à jour le statut du paiement (`SUCCESS`/`FAILED`) et celui de la commande (`PAID` si succès).
  5. Envoie un email fictif (`sendPaymentConfirmationEmail`).
- **Réponse** : objet paiement avec `status`, `transactionRef`, `createdAt`.
- **Codes** : `400` si `orderId` absent, `404` si commande inexistante, `403` si commande appartenant à un autre utilisateur.

#### GET `/api/payments/me`

- **Objectif** : historique financier côté client.
- **Réponse** : liste triée par `createdAt` décroissant, chaque élément contient `order` peuplé (montant total, items).

#### GET `/api/payments/:id`

- **Objectif** : service client/admin.
- **Contrôle d’accès** : seul le propriétaire ou un ADMIN peut consulter.
- **Réponse** : paiement + `order` populé.

## GraphQL

Le module expose également :

- **Query `payment(id: ID!)`** → détail d’un paiement (auth requise).
- **Mutation `createPayment(input)`** → même logique que le POST REST, accessible aux clients authentifiés.

## Notes techniques

- Les montants peuvent être fournis manuellement ou par défaut issus de `order.totalAmount`.
- Les méthodes (`method`) sont libres mais généralement `CARD`; le champ permet d’étendre vers `PAYPAL`, `BANK_TRANSFER`, etc.
- Important : l’API REST exige `validateBody(['orderId','amount','method'])`, veillez à envoyer ces trois champs même si l’amount correspond déjà au total.
