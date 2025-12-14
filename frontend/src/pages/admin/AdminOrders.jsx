import { useEffect, useState } from "react";
import api from "../../api.js";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        api
            .get("/admin/orders")
            .then((res) => setOrders(res.data || []))
            .catch((err) => console.error("Erreur chargement commandes:", err));
    }, []);

    return (
        <main className="p-6 text-white">
            <h1 className="text-2xl font-semibold mb-4">Gestion des Commandes</h1>

            {orders.length === 0 && <p>Aucune commande trouvée.</p>}

            <ul className="space-y-3">
                {orders.map((order) => (
                    <li
                        key={order._id}
                        className="bg-zinc-900 p-4 rounded-xl border border-zinc-700"
                    >
                        <p className="text-sm font-semibold">Utilisateur : {order.user?.email}</p>
                        <p className="text-xs">Total : {order.totalAmount} €</p>
                        <p className="text-xs">Statut : {order.status}</p>
                    </li>
                ))}
            </ul>
        </main>
    );
}
