import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        email: "",
        password: "",
        role: "USER",
    });

    // Charger les utilisateurs
    const load = () => {
        api.get("/admin/users")
            .then(res => setUsers(res.data || []))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        load();
    }, []);

    // Ouvrir la modal
    const openModal = (user = null) => {
        if (user) {
            setEditingId(user._id);
            setForm({
                email: user.email,
                password: "",
                role: user.role,
            });
        } else {
            setEditingId(null);
            setForm({
                email: "",
                password: "",
                role: "USER",
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
    };

    // Enregistrer
    const saveUser = async (e) => {
        e.preventDefault();

        try {
            let payload = { ...form };
            if (!payload.password) delete payload.password;

            if (editingId) {
                await api.put(`/admin/users/${editingId}`, payload);
            } else {
                await api.post("/admin/users", payload);
            }

            closeModal();
            load();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l’enregistrement.");
        }
    };

    // Supprimer
    const deleteUser = async (id) => {
        if (!window.confirm("Supprimer cet utilisateur ?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            load();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <main className="min-h-screen bg-black text-white px-8 py-10">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-wide">Gestion des Utilisateurs</h1>
                <button
                    onClick={() => openModal()}
                    className="px-5 py-2 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition"
                >
                    Ajouter un utilisateur
                </button>
            </div>

            {/* TABLEAU USERS */}
            <div className="space-y-4">
                {users.map((u) => (
                    <div
                        key={u._id}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex justify-between items-center hover:border-zinc-700 transition"
                    >
                        <div>
                            <p className="text-lg font-semibold">{u.email}</p>
                            <p className="text-sm text-zinc-400">Rôle : {u.role}</p>
                            <p className="text-xs text-zinc-500">
                                Créé le : {new Date(u.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => openModal(u)}
                                className="px-4 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition"
                            >
                                Modifier
                            </button>
                            <button
                                onClick={() => deleteUser(u._id)}
                                className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 transition"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fadeIn">
                    <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-lg border border-zinc-700 animate-scaleIn">
                        <h2 className="text-xl font-bold mb-6">
                            {editingId ? "Modifier l’utilisateur" : "Créer un utilisateur"}
                        </h2>

                        <form onSubmit={saveUser} className="space-y-4">
                            <input
                                type="email"
                                className="w-full p-3 bg-zinc-800 rounded-xl"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />

                            <input
                                type="password"
                                className="w-full p-3 bg-zinc-800 rounded-xl"
                                placeholder={editingId ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />

                            <select
                                className="w-full p-3 bg-zinc-800 rounded-xl"
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                            >
                                <option value="USER">Utilisateur</option>
                                <option value="ADMIN">Admin</option>
                            </select>

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
