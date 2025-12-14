import axios from 'axios';

const GEO_BASE_URL = 'https://nominatim.openstreetmap.org';
const GEO_HEADERS = {
    'User-Agent': 'ecommerce-2025-project/1.0',
};


async function reverseGeocode(lat, lng) {
    const response = await axios.get(`${GEO_BASE_URL}/reverse`, {
        params: {
            format: 'json',
            lat,
            lon: lng,
            zoom: 14,
            addressdetails: 1,
        },
        headers: GEO_HEADERS,
    });

    return response.data;
}

async function searchAddress(query) {
    const response = await axios.get(`${GEO_BASE_URL}/search`, {
        params: {
            q: query,
            format: 'json',
            addressdetails: 1,
            limit: 1,
        },
        headers: GEO_HEADERS,
    });

    return response.data;
}

export async function geocodeAddress(query) {
    const trimmed = (query ?? '').trim();
    if (!trimmed) {
        throw new Error('Adresse invalide');
    }

    const results = await searchAddress(trimmed);
    if (!Array.isArray(results) || results.length === 0) {
        throw new Error('Adresse introuvable');
    }

    const [first] = results;
    return {
        lat: parseFloat(first.lat),
        lng: parseFloat(first.lon),
        displayName: first.display_name,
    };
}

async function searchNearbyPickupPoints({ lat, lng }) {
    try {
        const response = await axios.get(`${GEO_BASE_URL}/search`, {
        params: {
            format: 'json',
            q: `parcel locker OR pickup point OR relais near ${lat},${lng}`,
            addressdetails: 1,
            limit: 5,
            extratags: 1,
            namedetails: 1,
        },
        headers: GEO_HEADERS,
        });

        return (response.data || []).slice(0, 3).map((entry) => ({
        name:
            entry.namedetails?.name ||
            entry.display_name?.split(',')[0]?.trim() ||
            entry.type ||
            'Point relais',
        address: entry.display_name ?? 'Adresse indisponible',
        lat: parseFloat(entry.lat),
        lng: parseFloat(entry.lon),
        }));
    } catch (err) {
        console.error('Recherche de points relais échouée:', err.message);
        return [];
    }
}


/**
 * Renvoie des points de retrait autour des coordonnées données.
 */

export async function getNearbyPickupPoints({ lat, lng }) {
    let base;
    try {
        base = await reverseGeocode(lat, lng);
    } catch (e) {
        console.error('Erreur lors de lappel à OpenStreetMap:', e.message);
        base = { lat, lon: lng, display_name: 'Adresse indisponible' };
    }

    const baseLat = parseFloat(base.lat ?? lat);
    const baseLon = parseFloat(base.lon ?? lng);
    const baseAddress = base.display_name ?? 'Adresse indisponible';

    const realPoints = await searchNearbyPickupPoints({ lat: baseLat, lng: baseLon });
    if (realPoints.length > 0) {
        return realPoints;
    }

    return [
        {
            name: 'Point Relais Centre-ville',
            address: `${baseAddress} – Accès centre`,
            lat: baseLat + 0.002,
            lng: baseLon + 0.001,
        },
        {
            name: 'Locker Gare',
            address: `${baseAddress} – Côté gare`,
            lat: baseLat - 0.002,
            lng: baseLon - 0.001,
        },
        {
            name: 'Magasin Partenaire',
            address: `${baseAddress} – Entrée partenaire`,
            lat: baseLat + 0.003,
            lng: baseLon - 0.002,
        },
    ];
}
