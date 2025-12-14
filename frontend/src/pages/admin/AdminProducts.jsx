import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        price: 0,
        stock: 0,
        brand: "",
        category: "",
        description: "",
        image: "",
        isActive: true,
    });

    // Charger les produits
    const load = () => {
        api.get("/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        load();
    }, []);

    // Ouvrir la modal (création / édition)
    const openModal = (product = null) => {
        if (product) {
            setEditingId(product._id);
            setForm({
                name: product.name,
                price: product.price,
                stock: product.stock,
                brand: product.brand,
                category: product.category,
                description: product.description,
                image: product.image,
                isActive: product.isActive,
            });
        } else {
            setEditingId(null);
            setForm({
                name: "",
                price: 0,
                stock: 0,
                brand: "",
                category: "",
                description: "",
                image: "",
                isActive: true,
            });
        }

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
    };

    // Enregistrer (PUT / POST)
    const saveProduct = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
            };

            if (editingId) {
                await api.put(`/products/${editingId}`, payload);
            } else {
                await api.post("/products", payload);
            }

            closeModal();
            load();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l’enregistrement.");
        }
    };

    // Supprimer
    const deleteProduct = async (id) => {
        if (!window.confirm("Supprimer ce produit ?")) return;
        try {
            await api.delete(`/products/${id}`);
            load();
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <main className="min-h-screen bg-black text-white px-8 py-10">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-wide">Gestion des Produits</h1>
                <button
                    onClick={() => openModal()}
                    className="px-5 py-2 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition"
                >
                    Ajouter un produit
                </button>
            </div>

            {/* GRID PRODUITS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => (
                    <div
                        key={p._id}
                        className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 hover:border-zinc-700 transition"
                    >
                        <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-60 object-cover rounded-xl mb-4"
                        />

                        <h3 className="text-xl font-semibold">{p.name}</h3>
                        <p className="text-sm text-zinc-400">{p.brand}</p>

                        <div className="flex justify-between mt-3">
                            <span className="text-orange-400 font-semibold">
                                {p.price.toFixed(2)} €
                            </span>
                            <span className="text-zinc-400">Stock : {p.stock}</span>
                        </div>

                        <div className="flex justify-between mt-5">
                            <button
                                onClick={() => openModal(p)}
                                className="px-4 py-1.5 text-sm bg-zinc-800 rounded-full hover:bg-zinc-700 transition"
                            >
                                Modifier
                            </button>
                            <button
                                onClick={() => deleteProduct(p._id)}
                                className="px-4 py-1.5 text-sm bg-red-600 rounded-full hover:bg-red-500 transition"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fadeIn">
                    <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-lg border border-zinc-700 shadow-xl animate-scaleIn">
                        <h2 className="text-xl font-bold mb-6">
                            {editingId ? "Modifier le produit" : "Ajouter un produit"}
                        </h2>

                        <form onSubmit={saveProduct} className="space-y-4">
                            <input
                                className="w-full p-3 bg-zinc-800 rounded-xl"
                                placeholder="Nom"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />

                            <input
                                className="w-full p-3 bg-zinc-800 rounded-xl"
                                placeholder="Marque"
                                value={form.brand}
                                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                            />

                            <input
                                className="w-full p-3 bg-zinc-800 rounded-xl"
                                placeholder="Catégorie"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            />

                            <input
                                type="number"
                                className="w-full p-3 bg-zinc-800 rounded-xl"
                                placeholder="Prix"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                required
                            />

                            <input
                                type="number"
                                className="w-full p-3 bg-zinc-800 rounded-xl"
                                placeholder="Stock"
                                value={form.stock}
                                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                required
                            />

                            <input
                                className="w-full p-3 bg-zinc-800 rounded-xl"
                                placeholder="URL image"
                                value={form.image}
                                onChange={(e) => setForm({ ...form, image: e.target.value })}
                            />

                            <textarea
                                className="w-full p-3 bg-zinc-800 rounded-xl"
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />

                            {/* BOUTONS */}
                            <div className="flex justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2 rounded-full bg-zinc-700 hover:bg-zinc-600 transition"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
