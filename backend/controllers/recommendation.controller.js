import { getRecommendationsForUser } from '../services/recommendation.service.js';
import { getNearbyPickupPoints, geocodeAddress } from '../services/geolocation.service.js';

export const getRecommendations = async (req, res) => {
  const userId = req.user.id;
  const { lat, lng, address } = req.query;

  const recommendations = await getRecommendationsForUser(userId);
  let pickupPoints = [];
  let pickupOrigin = null;
  let pickupError = '';

  let coords = null;

  if (address) {
    try {
      const geocoded = await geocodeAddress(address);
      coords = { lat: geocoded.lat, lng: geocoded.lng };
      pickupOrigin = {
        lat: geocoded.lat,
        lng: geocoded.lng,
        label: geocoded.displayName,
        source: 'address',
      };
    } catch (e) {
      pickupError = 'Adresse introuvable.';
    }
  } else if (lat && lng) {
    coords = { lat: parseFloat(lat), lng: parseFloat(lng) };
    pickupOrigin = {
      lat: coords.lat,
      lng: coords.lng,
      label: 'Ta position',
      source: 'geolocation',
    };
  }

  if (coords) {
    try {
      pickupPoints = await getNearbyPickupPoints(coords);
    } catch (e) {
      console.error(
        'Erreur lors de la récupération des points de retrait:',
        e.message
      );
      pickupError = 'Impossible de récupérer les points relais.';
    }
  }

  res.json({ recommendations, pickupPoints, pickupOrigin, pickupError });
};
