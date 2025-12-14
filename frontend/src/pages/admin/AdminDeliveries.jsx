import { useEffect, useState } from "react";
import api from "../../api.js";

const STATUS_LABELS = {
    PENDING: "En attente",
    PREPARING: "Préparation",
    SHIPPED: "En transit",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
};

const STATUS_ORDER = ["PENDING", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminDeliveries() {
    const [deliveries, setDeliveries] = useState([]);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDeliveries = async (status = "ALL") => {
        try {
            setLoading(true);
            setError("");

            const params = {};
            if (status !== "ALL") params.status = status;

            // 🔥 IMPORTANT : on appelle /deliveries (pas /admin/deliveries)
            const res = await api.get("/deliveries", { params });
            setDeliveries(res.data || []);
        } catch (err) {
            console.error("Erreur chargement livraisons:", err);
            setError("Impossible de charger les livraisons.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDeliveries(filterStatus);
    }, [filterStatus]);

    const handleStatusChange = async (deliveryId, newStatus) => {
        try {
            await api.patch(`/deliveries/${deliveryId}/status`, { status: newStatus });
            // On recharge la liste avec le même filtre
            loadDeliveries(filterStatus);
        } catch (err) {
            console.error("Erreur update statut livraison:", err);
            alert("Impossible de mettre à jour le statut de la livraison.");
        }
    };

    return (
        <main className="min-h-screen bg-black text-white px-6 py-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/60">
            📦
          </span>
                    Gestion des livraisons
                </h1>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-xs bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1 text-zinc-200"
                >
                    <option value="ALL">Tous les statuts</option>
                    {STATUS_ORDER.map((s) => (
                        <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <p className="text-sm text-zinc-400">Chargement des livraisons…</p>
            )}

            {error && (
                <p className="text-sm text-red-400 mb-3">{error}</p>
            )}

            {!loading && deliveries.length === 0 && (
                <p className="text-sm text-zinc-500">Aucune livraison trouvée pour ce filtre.</p>
            )}

            <div className="space-y-4">
                {deliveries.map((d) => (
                    <div
                        key={d._id}
                        className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                    >
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-white">
                                Commande #{d.order?._id?.slice(-6) || "—"}
                            </p>
                            <p className="text-xs text-zinc-400">
                                Client : {d.user?.email || "Inconnu"}
                            </p>
                            <p className="text-xs text-zinc-500">
                                {d.addressLine1}
                                {d.addressLine2 ? `, ${d.addressLine2}` : ""} — {d.postalCode} {d.city},{" "}
                                {d.country}
                            </p>
                            <p className="text-[11px] text-zinc-500">
                                Créée le : {new Date(d.createdAt).toLocaleString("fr-FR")}
                            </p>
                            {d.trackingNumber && (
                                <p className="text-[11px] text-zinc-400">
                                    N° de suivi : <span className="text-orange-400">{d.trackingNumber}</span>
                                </p>
                            )}
                        </div>

                        <div className="mt-3 md:mt-0 flex flex-col items-end gap-2">
                            <select
                                value={d.status}
                                onChange={(e) => handleStatusChange(d._id, e.target.value)}
                                className="text-xs bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1 text-zinc-200"
                            >
                                {STATUS_ORDER.map((s) => (
                                    <option key={s} value={s}>
                                        {STATUS_LABELS[s]}
                                    </option>
                                ))}
                            </select>

                            <span className="text-[11px] text-zinc-500">
                Dernière maj : {new Date(d.updatedAt).toLocaleString("fr-FR")}
              </span>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
