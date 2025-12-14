import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api.js";

const STATUS_LABELS = {
    PENDING: "Préparation",
    SHIPPED: "En transit",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
};

const STEPS = ["PENDING", "SHIPPED", "DELIVERED"];

export default function TrackDelivery() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get(`/deliveries/order/${orderId}`);
                setDelivery(res.data);
                setError("");
            } catch (err) {
                console.error("Erreur chargement livraison:", err);
                setError("Impossible de charger les informations de livraison.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [orderId]);

    const currentStatus = delivery?.status || "PENDING";
    const currentIndex = STEPS.indexOf(currentStatus);

    return (
        <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
            <section className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 mb-2"
                >
                    ← Retour
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-white">
                            Suivi de livraison
                        </h1>
                        <p className="text-xs text-zinc-400 mt-1">
                            Commande #{orderId?.slice(-6)}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <p className="text-sm text-zinc-400">Chargement…</p>
                ) : error ? (
                    <p className="text-sm text-red-400">{error}</p>
                ) : !delivery ? (
                    <p className="text-sm text-zinc-500">
                        Aucune information de livraison trouvée.
                    </p>
                ) : (
                    <>
                        {/* CARTE INFO PRINCIPALE */}
                        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col gap-3 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-zinc-500">Numéro de suivi</p>
                                    <p className="text-sm font-semibold text-white">
                                        {delivery.trackingNumber}
                                    </p>
                                </div>
                                <span
                                    className={`text-[11px] px-3 py-1 rounded-full border uppercase tracking-wide
                  ${
                                        delivery.status === "CANCELLED"
                                            ? "border-red-600 text-red-400"
                                            : delivery.status === "DELIVERED"
                                                ? "border-emerald-500 text-emerald-400"
                                                : "border-orange-500 text-orange-400"
                                    }`}
                                >
                  {STATUS_LABELS[delivery.status] || delivery.status}
                </span>
                            </div>

                            <div className="mt-2 text-xs text-zinc-400 space-y-1">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                                    Adresse de livraison
                                </p>
                                <p className="text-zinc-300">
                                    {delivery.addressLine1}
                                    {delivery.addressLine2 ? `, ${delivery.addressLine2}` : ""}
                                </p>
                                <p>
                                    {delivery.postalCode} {delivery.city},{" "}
                                    {delivery.country || "France"}
                                </p>
                            </div>

                            <p className="mt-2 text-[11px] text-zinc-500">
                                Dernière mise à jour :{" "}
                                {new Date(delivery.updatedAt).toLocaleString("fr-FR")}
                            </p>
                        </div>

                        {/* TIMELINE */}
                        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-5">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-4">
                                Statut de la livraison
                            </p>

                            {delivery.status === "CANCELLED" ? (
                                <p className="text-sm text-red-400">
                                    Cette livraison a été annulée.
                                </p>
                            ) : (
                                <div className="flex items-center justify-between gap-3">
                                    {STEPS.map((step, idx) => {
                                        const active = idx <= currentIndex;
                                        const label = STATUS_LABELS[step];

                                        return (
                                            <div
                                                key={step}
                                                className="flex-1 flex flex-col items-center"
                                            >
                                                <div className="flex items-center w-full">
                                                    {/* bullet */}
                                                    <div
                                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold
                            ${
                                                            active
                                                                ? "bg-orange-500 text-black shadow-[0_0_25px_rgba(249,115,22,0.7)]"
                                                                : "bg-zinc-900 border border-zinc-700 text-zinc-500"
                                                        }`}
                                                    >
                                                        {idx + 1}
                                                    </div>

                                                    {/* bar (sauf dernier) */}
                                                    {idx < STEPS.length - 1 && (
                                                        <div className="flex-1 h-px mx-2 bg-zinc-800 relative overflow-hidden">
                                                            <div
                                                                className={`absolute inset-0 transition-all ${
                                                                    idx < currentIndex
                                                                        ? "bg-orange-500"
                                                                        : "bg-transparent"
                                                                }`}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <p
                                                    className={`mt-2 text-[11px] text-center ${
                                                        active ? "text-zinc-100" : "text-zinc-500"
                                                    }`}
                                                >
                                                    {label}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
