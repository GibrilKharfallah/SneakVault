import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <main className="min-h-screen bg-black text-white px-6 py-10">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Produits */}
                <Link
                    to="/admin/products"
                    className="p-6 rounded-2xl bg-zinc-900 border border-zinc-700 hover:border-orange-500 transition"
                >
                    <h2 className="text-xl font-semibold text-orange-400 mb-2">
                        Gestion des produits
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Ajouter, modifier, supprimer, gérer le stock.
                    </p>
                </Link>

                {/* Commandes */}
                <Link
                    to="/admin/orders"
                    className="p-6 rounded-2xl bg-zinc-900 border border-zinc-700 hover:border-orange-500 transition"
                >
                    <h2 className="text-xl font-semibold text-orange-400 mb-2">
                        Gestion des commandes
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Voir toutes les commandes des clients.
                    </p>
                </Link>

                {/* Utilisateurs */}
                <Link
                    to="/admin/users"
                    className="p-6 rounded-2xl bg-zinc-900 border border-zinc-700 hover:border-orange-500 transition"
                >
                    <h2 className="text-xl font-semibold text-orange-400 mb-2">
                        Gestion des utilisateurs
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Voir les utilisateurs, définir les rôles.
                    </p>
                </Link>

                {/* 🚀 NEW : Deliveries */}
                <Link
                    to="/admin/deliveries"
                    className="p-6 rounded-2xl bg-zinc-900 border border-zinc-700 hover:border-orange-500 transition"
                >
                    <h2 className="text-xl font-semibold text-orange-400 mb-2">
                        Gestion des livraisons
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Suivi global, mise à jour des statuts et numéros de suivi.
                    </p>
                </Link>
            </div>
        </main>
    );
}
