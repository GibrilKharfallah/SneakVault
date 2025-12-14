# Exemples d'intégration

## 1. Appel direct vers Nominatim

```bash
curl "https://nominatim.openstreetmap.org/reverse?format=json&lat=48.8566&lon=2.3522&zoom=14&addressdetails=1" \
  -H "User-Agent: ecommerce-2025-project/1.0"
```

Résultat : JSON contenant `lat`, `lon`, `display_name`, `address`… Utilisable tel quel si vous souhaitez tester sans passer par le backend.

## 2. Service backend (`geolocation.service.js`)

```js
async function getNearbyPickupPoints({ lat, lng }) {
  const base = await reverseGeocode(lat, lng); // appel Nominatim
  const baseLat = parseFloat(base.lat ?? lat);
  const baseLon = parseFloat(base.lon ?? lng);

  return [
    { name: 'Point Relais Centre-ville', lat: baseLat + 0.002, lng: baseLon + 0.001 },
    { name: 'Locker Gare', lat: baseLat - 0.002, lng: baseLon - 0.001 },
    { name: 'Magasin Partenaire', lat: baseLat + 0.003, lng: baseLon - 0.002 },
  ];
}
```

- Si `reverseGeocode` échoue, `lat`/`lng` fournis par l’utilisateur sont utilisés afin de toujours retourner une réponse.
- Les points retournés sont fictifs mais proches de la position réelle, ce qui suffit pour la démonstration de l’intégration externe.

## 3. Consommation côté API Recommandations

```js
export const getRecommendations = async (req, res) => {
  const { lat, lng } = req.query;
  const recommendations = await getRecommendationsForUser(req.user.id);
  let pickupPoints = [];

  if (lat && lng) {
    pickupPoints = await getNearbyPickupPoints({ lat: parseFloat(lat), lng: parseFloat(lng) });
  }

  res.json({ recommendations, pickupPoints });
};
```

L’endpoint `/api/recommendations` renvoie donc toujours les recommandations produits, et ajoute `pickupPoints` uniquement si la position est disponible (géolocalisation navigateur ou saisie manuelle).

## 4. Utilisation React (page Recommendations)

```js
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (pos) => fetchRecommendations({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    () => fetchRecommendations()
  );
} else {
  fetchRecommendations();
}
```

- `fetchRecommendations` appelle `GET /api/recommendations`.
- Les points relais reçus sont affichés dans des cartes stylisées (nom + lat/lng) pour illustrer la connexion entre API interne et service externe.

## 5. Idées d’extensions

1. Stocker l’adresse complète renvoyée par Nominatim pour pré-remplir un formulaire de livraison.
2. Remplacer les points fictifs par de vrais partenaires (fichiers JSON ou base de données).
3. Cacher les appels externes derrière un cache Redis afin de limiter la charge sur Nominatim.
