import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

export default function Cart() {
    const [cart, setCart] = useState(null);
    const navigate = useNavigate();

    const loadCart = () => {
        api
            .get("/cart")
            .then((res) => setCart(res.data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        loadCart();
    }, []);

    const removeItem = async (itemId) => {
        try {
            await api.delete(`/cart/${itemId}`);
            loadCart();
        } catch (err) {
            console.error(err);
        }
    };

    const total =
        cart?.items?.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        ) || 0;

    const hasStockError =
        cart?.items?.some((item) => item.quantity > item.product.stock) || false;

    return (
        <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
            <section className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-xl font-semibold text-white mb-4">Panier</h1>

                {!cart || cart.items.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                        Ton panier est vide. Ajoute une paire depuis la page produits.
                    </p>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            {cart.items.map((item) => {
                                const stockOK = item.quantity <= item.product.stock;
                                const outOfStock = item.product.stock === 0;

                                return (
                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-900 overflow-hidden flex items-center justify-center">
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm text-white">{item.product.name}</p>

                                                <p
                                                    className={`text-[11px] ${
                                                        stockOK
                                                            ? "text-zinc-500"
                                                            : outOfStock
                                                                ? "text-red-500"
                                                                : "text-yellow-500"
                                                    }`}
                                                >
                                                    {outOfStock
                                                        ? "RUPTURE DE STOCK"
                                                        : !stockOK
                                                            ? `Stock insuffisant (stock disponible : ${item.product.stock})`
                                                            : `${item.quantity} × ${item.product.price.toFixed(2)} €`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-orange-400">
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </span>
                                            <button
                                                onClick={() => removeItem(item._id)}
                                                className="text-[11px] text-zinc-500 hover:text-red-400"
                                            >
                                                Retirer
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                            <p className="text-sm text-zinc-400">Total</p>
                            <p className="text-lg font-semibold text-orange-400">
                                {total.toFixed(2)} €
                            </p>
                        </div>

                        <button
                            disabled={hasStockError}
                            onClick={() => navigate("/checkout")}
                            className={`w-full md:w-auto px-5 py-2.5 rounded-full text-sm font-semibold transition
                ${
                                hasStockError
                                    ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                                    : "bg-white text-black hover:bg-zinc-100"
                            }`}
                        >
                            {hasStockError
                                ? "Stock insuffisant — corrige ton panier"
                                : "Passer la commande"}
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
