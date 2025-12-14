import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("auth-change"));
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Email ou mot de passe invalide.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-neutral-950 to-black px-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl">
        <h1 className="text-xl font-semibold text-white mb-1">Connexion</h1>
        <p className="text-xs text-zinc-400 mb-5">
          Accède à ton compte pour gérer ton panier, tes commandes et tes recos.
        </p>

        {error && (
          <p className="mb-3 text-xs text-red-400 bg-red-950/40 px-3 py-2 rounded-xl border border-red-900">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 rounded-xl bg-white text-black text-sm font-semibold py-2 hover:bg-zinc-100 transition"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-4 text-[11px] text-zinc-400">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-orange-400 hover:text-orange-300">
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
}
