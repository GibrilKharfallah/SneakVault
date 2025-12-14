import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api
            .get("/orders/me")
            .then((res) => setOrders(res.data || []))
            .catch((err) => console.error("Erreur chargement commandes:", err));
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
            <section className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-white">Mes commandes</h1>
                    <span className="text-[11px] text-zinc-500">
            {orders.length} commande{orders.length > 1 ? "s" : ""}
          </span>
                </div>

                {orders.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                        Aucune commande pour l&apos;instant.
                    </p>
                ) : (
                    <div className="space-y-5">
                        {orders.map((o) => (
                            <div
                                key={o._id}
                                className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-[0_0_40px_rgba(24,24,27,0.9)]"
                            >
                                {/* HEADER */}
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm text-white font-medium">
                                            Commande #{o._id.slice(-6)}
                                        </p>
                                        <p className="text-[11px] text-zinc-500">
                                            Passée le{" "}
                                            {new Date(o.createdAt).toLocaleDateString("fr-FR")}
                                        </p>
                                    </div>

                                    <span
                                        className={`text-[11px] px-3 py-1 rounded-full border uppercase tracking-wide
                    ${
                                            o.status === "CANCELLED"
                                                ? "border-red-600 text-red-400"
                                                : o.status === "DELIVERED"
                                                    ? "border-emerald-500 text-emerald-400"
                                                    : "border-zinc-700 text-zinc-300"
                                        }`}
                                    >
                    {o.status}
                  </span>
                                </div>

                                {/* PRODUITS */}
                                <ul className="mt-3 text-xs text-zinc-400 space-y-1">
                                    {o.items.map((it, idx) => (
                                        <li key={idx}>
                                            {it.product?.name || "Produit"} — {it.quantity} ×{" "}
                                            {it.unitPrice.toFixed(2)} €
                                        </li>
                                    ))}
                                </ul>

                                {/* TOTAL + BOUTON TRACK */}
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm text-orange-400 font-semibold">
                                        Total : {o.totalAmount.toFixed(2)} €
                                    </p>

                                    <button
                                        onClick={() => navigate(`/delivery/${o._id}`)}
                                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full
                      bg-white text-black text-[11px] font-semibold
                      hover:bg-zinc-200 active:scale-[0.98] transition"
                                    >
                                        Suivre la livraison
                                        <span>↗</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
