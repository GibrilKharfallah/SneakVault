# API externe de géolocalisation

## Objectif

Pouvoir enrichir l’API Recommandations avec des points relais proches de l’utilisateur. Pour cela, le backend interroge un service cartographique public afin de récupérer une localisation “réelle” puis génère 3 points de retrait fictifs autour de cette zone.

## Service utilisé

- **Provider** : [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/).
- **Endpoint** : `GET /reverse`.
- **Headers** : `User-Agent: ecommerce-2025-project/1.0` (obligatoire côté OSM).
- **Authentification** : aucune clé nécessaire pour un usage pédagogique (respect du rate limit public).

## Flux technique

1. Le frontend appelle `GET /api/recommendations?lat=48.8566&lng=2.3522`.
2. Le backend (service `geolocation.service.js`) invoque Nominatim :

   ```text
   https://nominatim.openstreetmap.org/reverse?format=json&lat=48.8566&lon=2.3522&zoom=14&addressdetails=1
   ```

3. La réponse contient des coordonnées précises + informations d’adresse.
4. Même si l’appel échoue, le service continue en réutilisant les coordonnées fournies.
5. Trois points relais sont synthétisés autour de `base.lat/base.lon` :
   - Point Relais Centre-ville
   - Locker Gare
   - Magasin Partenaire

## Structure de réponse Nominatim (extrait)

```json
{
  "place_id": "12345",
  "lat": "48.856614",
  "lon": "2.3522219",
  "display_name": "Paris, Île-de-France, France",
  "address": {
    "city": "Paris",
    "postcode": "75000",
    "country": "France"
  }
}
```

Le service backend ne persiste pas ces données, elles servent uniquement à positionner les points relais fictifs.

## Limites et bonnes pratiques

- Respecter le **rate limit** public d’OpenStreetMap (ne pas spammer en boucle avec la géolocalisation auto).
- Fournir un `User-Agent` descriptif comme l’exige la politique OSM.
- Prévoir une stratégie de repli (déjà implémentée) si l’API externe est indisponible.

## Personnalisation possible

- Remplacer Nominatim par une API disposant d’une clé (Google Maps Geocoding, Here, Mapbox…) : il suffit d’adapter `geolocation.service.js`.
- Persister les points relais dans MongoDB pour éviter de recalculer à chaque requête.
- Ajouter des métadonnées (horaires d’ouverture, adresse exacte) si une source réelle est disponible.
