# API Recommandations

## Présentation

Cette API combine deux briques : des recommandations produits basées sur l’historique de commandes et la proposition de points relais proches grâce à l’API externe OpenStreetMap (Nominatim). Elle illustre l’agrégation d’une logique métier interne et d’un service tiers.

## Endpoint REST

| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| GET | `/api/recommendations` | JWT requis | Retourne des produits suggérés + points relais optionnels. |

### Paramètres

- **Query** : `lat`, `lng` (optionnels). Si fournis, l’API externe est appelée pour identifier la ville la plus proche et générer trois points relais fictifs autour des coordonnées.

### Réponse type

```json
{
  "recommendations": [
    {
      "product": {
        "_id": "...",
        "name": "Runner 2025",
        "price": 159.9,
        "stock": 12
      },
      "totalQuantity": 48
    }
  ],
  "pickupPoints": [
    { "name": "Point Relais Centre-ville", "lat": 48.8568, "lng": 2.3524 },
    { "name": "Locker Gare", "lat": 48.8528, "lng": 2.3514 },
    { "name": "Magasin Partenaire", "lat": 48.8598, "lng": 2.3504 }
  ]
}
```

### Fonctionnement

1. `recommendation.service.js` récupère toutes les commandes de l’utilisateur pour identifier les produits déjà achetés.
2. Agrégation Mongo (`Order.aggregate`) calcule les produits les plus vendus globalement (`totalQuantity`).
3. Les produits populaires non encore achetés par l’utilisateur sont retournés (limite par défaut : 10).
4. Si `lat/lng` présents, `geolocation.service.js` appelle `https://nominatim.openstreetmap.org/reverse` (User-Agent custom) pour obtenir une base géographique, puis génère trois points relais à proximité.
5. Le contrôleur assemble et renvoie `{ recommendations, pickupPoints }`.

## Notes techniques

- L’appel OpenStreetMap est encapsulé dans un `try/catch`; en cas d’échec, les coordonnées d’entrée sont utilisées telles quelles afin de toujours renvoyer des points.
- Aucun cache n’est mis en place : éviter d’interroger l’endpoint en boucle avec géolocalisation activée.
- Les produits renvoyés héritent du schéma `Product` complet, ce qui permet au front d’afficher image, prix, stock, etc.
