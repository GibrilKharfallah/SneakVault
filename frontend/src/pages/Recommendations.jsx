import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import api from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

const defaultMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom(), {
        animate: true,
      });
    }
  }, [position, map]);

  return null;
}

export default function Recommendations() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [referencePoint, setReferencePoint] = useState(null);
  const [addressInput, setAddressInput] = useState("");
  const [pickupLoading, setPickupLoading] = useState(false);
  const [pickupError, setPickupError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecommendations = useCallback(
    async (params = {}, { fullPageLoading = false } = {}) => {
      fullPageLoading ? setLoading(true) : setPickupLoading(true);

      try {
        const finalParams = { ...params, _ts: Date.now() };
        const res = await api.get("/recommendations", { params: finalParams });
        const payload =
          res.data && typeof res.data === "object" ? res.data : null;
        if (!payload) return;

        setRecommendations(payload.recommendations || []);
        setPickupPoints(payload.pickupPoints || []);
        setReferencePoint(payload.pickupOrigin || null);
        setPickupError(payload.pickupError || "");
        if (fullPageLoading) setError("");
      } catch (err) {
        if (fullPageLoading) {
          setError("Impossible de charger les recommandations.");
        } else {
          setPickupError("Impossible de mettre à jour les points relais.");
        }
        console.error(err);
      } finally {
        fullPageLoading ? setLoading(false) : setPickupLoading(false);
      }
    },
    []
  );


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          fetchRecommendations(
            { lat: pos.coords.latitude, lng: pos.coords.longitude },
            { fullPageLoading: true }
          ),
        () => fetchRecommendations({}, { fullPageLoading: true })
      );
    } else {
      fetchRecommendations({}, { fullPageLoading: true });
    }
  }, [fetchRecommendations]);

  const hasPickupPoints = pickupPoints.length > 0;
  const mapCenter = referencePoint
    ? [referencePoint.lat, referencePoint.lng]
    : hasPickupPoints
    ? [pickupPoints[0].lat, pickupPoints[0].lng]
    : [0, 0];

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setPickupError("La géolocalisation n'est pas disponible.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchRecommendations({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => setPickupError("Impossible de récupérer ta position.")
    );
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const query = addressInput.trim();
    if (!query) {
      setPickupError("Saisis une adresse.");
      return;
    }
    fetchRecommendations({ address: query });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
      <section className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Recommandations &amp; points relais
          </h1>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {loading ? (
          <p className="text-sm text-zinc-400">Chargement…</p>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm uppercase tracking-wide text-zinc-400">
                  Produits recommandés
                </h2>
                <span className="text-[11px] text-zinc-500">
                  Basé sur ton historique d’achats
                </span>
              </div>
              {recommendations.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Aucun produit recommandé pour le moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {recommendations.map(({ product }) => (
                    <ProductCard
                      key={product._id}
                      product={{
                        ...product,
                        stockQuantity:
                          product.stockQuantity ?? product.stock ?? 0,
                      }}
                      onClick={() => navigate(`/products/${product._id}`)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-zinc-400">
                Points relais
              </h2>

              <div className="space-y-2">
                <button
                  type="button"
                  className="w-full rounded-xl border border-zinc-800 px-3 py-2 text-sm text-white hover:bg-zinc-900 sm:w-auto"
                  onClick={handleUseLocation}
                >
                  Utiliser ma position
                </button>

                <form
                  className="flex flex-col gap-2 sm:flex-row"
                  onSubmit={handleAddressSubmit}
                >
                  <input
                    className="flex-1 rounded-xl border border-zinc-800 bg-transparent px-3 py-2 text-sm text-white placeholder:text-zinc-600"
                    type="text"
                    placeholder="Adresse ou ville"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-black"
                  >
                    Chercher
                  </button>
                </form>

                {pickupError && (
                  <p className="text-xs text-red-400">{pickupError}</p>
                )}
              </div>

              {pickupLoading ? (
                <p className="text-sm text-zinc-500">
                  Recherche des points relais…
                </p>
              ) : !hasPickupPoints ? (
                <p className="text-sm text-zinc-500">
                  Utilise ta position ou saisis une adresse pour voir des points
                  relais.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="h-80 rounded-2xl overflow-hidden border border-zinc-800">
                    <MapContainer
                      center={mapCenter}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {referencePoint && (
                        <Marker
                          position={[referencePoint.lat, referencePoint.lng]}
                          icon={defaultMarkerIcon}
                        >
                          <Popup>
                            {referencePoint.label || "Point de référence"}
                          </Popup>
                        </Marker>
                      )}
                      {pickupPoints.map((p) => (
                        <Marker
                          key={`${p.name}-${p.lat}-${p.lng}`}
                          position={[p.lat, p.lng]}
                          icon={defaultMarkerIcon}
                        >
                          <Popup>
                            <strong>{p.name}</strong>
                            <br />
                            {p.address}
                          </Popup>
                        </Marker>
                      ))}
                      {referencePoint && (
                        <RecenterMap position={referencePoint} />
                      )}
                    </MapContainer>
                  </div>

                  <div className="space-y-2">
                    {pickupPoints.map((p) => (
                      <div
                        key={`${p.name}-${p.address}`}
                        className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4"
                      >
                        <h3 className="text-sm text-white">{p.name}</h3>
                        <p className="text-xs text-zinc-400">{p.address}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
