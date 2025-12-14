import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api.js";

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);

    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        api.get(`/products/${id}`)
            .then((res) => setProduct(res.data))
            .catch(console.error);

        api.get(`/reviews/product/${id}`)
            .then((res) => setReviews(res.data || []))
            .catch(() => {});
    }, [id]);

    const handleQtyChange = (value) => {
        const num = Number(value);
        if (num < 1) return setQty(1);
        if (num > product.stock) return setQty(product.stock);
        setQty(num);
    };

    const addToCart = async () => {
        try {
            if (qty > product.stock) {
                alert("Stock insuffisant.");
                return;
            }
            await api.post("/cart", { productId: id, quantity: qty });
            navigate("/cart");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'ajout au panier.");
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/reviews/product/${id}`, reviewForm);
            setReviews((prev) => [res.data, ...prev]);
            setReviewForm({ rating: 5, comment: "" });
        } catch (err) {
            alert("Impossible d'ajouter l'avis (connecte-toi ?).");
        }
    };

    const handleDeleteReview = async (reviewId, isAdmin) => {
        const endpoint = isAdmin
            ? `/reviews/admin/${reviewId}`
            : `/reviews/${reviewId}`;

        if (!window.confirm("Supprimer cet avis ?")) return;

        try {
            await api.delete(endpoint);

            // Animation fade-out
            setReviews((prev) =>
                prev.filter((r) => r._id !== reviewId)
            );
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression.");
        }
    };

    if (!product) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-black text-zinc-400">
                Chargement...
            </main>
        );
    }

    const outOfStock = product.stock <= 0;

    return (
        <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
            <section className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">

                {/* IMAGE */}
                <div className="flex flex-col gap-4">
                    <div className="relative h-72 md:h-96 bg-gradient-to-tr from-zinc-900 to-black rounded-3xl border border-zinc-800 flex items-center justify-center shadow-xl">
                        <div className="w-64 h-40 bg-black rounded-[2rem] rotate-[-12deg] shadow-2xl flex items-center justify-center overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain scale-110"
                            />
                        </div>

                        <span className="absolute top-4 left-4 text-[11px] uppercase tracking-[0.25em] text-zinc-500">
                            {product.category}
                        </span>

                        <span className="absolute bottom-4 right-4 text-xs px-3 py-1 rounded-full border border-zinc-700 bg-black/60 text-zinc-200">
                            {outOfStock ? "Rupture de stock" : "Disponible"}
                        </span>
                    </div>
                </div>

                {/* DETAILS */}
                <div className="flex flex-col gap-6">
                    <h1 className="text-3xl font-semibold text-white">{product.name}</h1>
                    <p className="text-sm text-zinc-400">{product.description}</p>

                    <div className="flex items-center gap-5">
                        <span className="text-4xl font-bold text-orange-400">
                            {product.price.toFixed(2)} €
                        </span>
                        <span className="text-xs text-zinc-500">
                            Stock : {product.stock}
                        </span>
                    </div>

                    {!outOfStock && (
                        <div className="flex items-center gap-4">
                            <label className="text-xs text-zinc-400">Quantité</label>
                            <input
                                type="number"
                                min="1"
                                max={product.stock}
                                value={qty}
                                onChange={(e) => handleQtyChange(e.target.value)}
                                className="w-20 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-1 text-sm text-white"
                            />
                        </div>
                    )}

                    <button
                        disabled={outOfStock}
                        onClick={addToCart}
                        className={`w-full md:w-auto px-6 py-3 rounded-full text-sm font-semibold transition shadow-lg
                            ${
                            outOfStock
                                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                : "bg-white text-black hover:bg-zinc-200"
                        }`}
                    >
                        {outOfStock ? "Indisponible" : "Ajouter au panier"}
                    </button>

                    {/* AVIS */}
                    <div className="mt-6 space-y-4">
                        <h2 className="text-sm font-semibold text-zinc-200">
                            Avis ({reviews.length})
                        </h2>

                        {/* Form avis */}
                        <form
                            onSubmit={submitReview}
                            className="space-y-3 bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4"
                        >
                            <div className="flex items-center gap-3">
                                <label className="text-xs text-zinc-400">Note</label>
                                <select
                                    value={reviewForm.rating}
                                    onChange={(e) =>
                                        setReviewForm((f) => ({
                                            ...f,
                                            rating: Number(e.target.value),
                                        }))
                                    }
                                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-white"
                                >
                                    {[5, 4, 3, 2, 1].map((n) => (
                                        <option key={n} value={n}>
                                            {n} ★
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <textarea
                                value={reviewForm.comment}
                                onChange={(e) =>
                                    setReviewForm((f) => ({
                                        ...f,
                                        comment: e.target.value,
                                    }))
                                }
                                placeholder="Partage ton avis..."
                                className="w-full text-xs rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-white min-h-[70px]"
                            />

                            <button
                                type="submit"
                                className="px-4 py-2 rounded-full text-xs bg-orange-500 text-black font-semibold hover:bg-orange-400 transition"
                            >
                                Publier un avis
                            </button>
                        </form>

                        {/* LISTE DES AVIS */}
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                            {reviews.length === 0 && (
                                <p className="text-xs text-zinc-500">Aucun avis pour le moment.</p>
                            )}

                            {reviews.map((r) => {
                                const isOwner = r.user?._id === currentUser.id;
                                const isAdmin = currentUser.role === "ADMIN";

                                return (
                                    <div
                                        key={r._id}
                                        className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-zinc-300">
                                                    {r.user?.email || "Client"}
                                                </span>

                                                {isOwner && (
                                                    <span className="text-[10px] px-2 py-0.5 bg-orange-500 text-black rounded-full">
                                                        Vous
                                                    </span>
                                                )}

                                                {isAdmin && !isOwner && (
                                                    <span className="text-[10px] px-2 py-0.5 bg-red-600 text-white rounded-full">
                                                        Admin
                                                    </span>
                                                )}
                                            </div>

                                            <span className="text-xs text-yellow-400">
                                                {"★".repeat(r.rating)}
                                            </span>
                                        </div>

                                        <p className="text-xs text-zinc-400 mt-1">
                                            {r.comment}
                                        </p>

                                        {(isOwner || isAdmin) && (
                                            <button
                                                className="mt-2 flex items-center gap-1 text-[11px] text-red-500 hover:text-red-400"
                                                onClick={() =>
                                                    handleDeleteReview(r._id, isAdmin)
                                                }
                                            >
                                                🗑 Supprimer
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
