import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error("Erreur chargement produits:", err));
  }, []);

  const hero = (
    <section className="max-w-6xl mx-auto px-4 pt-10 pb-8 flex flex-col md:flex-row items-center gap-10">
      <div className="flex-1 flex flex-col gap-4">
        <p className="text-[11px] tracking-[0.3em] uppercase text-zinc-500">
          The future of sneakers
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
          Une nouvelle manière de découvrir{" "}
          <span className="text-orange-400">les paires du moment</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-md">
          Trouvez chaussure à votre pied, commandez, suivez vos livraisons &amp;
          découvrez des points relais près de chez vous.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => navigate("/products")}
            className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition"
          >
            Voir les paires
          </button>
          <button
            onClick={() => navigate("/recommendations")}
            className="px-4 py-2.5 rounded-full border border-zinc-700 text-sm text-zinc-200 hover:border-orange-400 hover:text-orange-300 transition"
          >
            Recommendations &amp; points relais
          </button>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-orange-600 to-yellow-300 flex items-center justify-center shadow-[0_0_80px_rgba(249,115,22,0.6)]">
          <div className="w-48 h-28 md:w-60 md:h-32 bg-black rounded-[2rem] rotate-[-18deg] border border-zinc-700 shadow-xl flex items-center justify-center">
            <span className="text-6xl md:text-7xl">👟</span>
          </div>
        </div>
      </div>
    </section>
  );

  const grid = (
    <section className="max-w-6xl mx-auto px-4 pb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-[0.18em]">
          Sélection du moment
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="text-[11px] text-zinc-400 hover:text-orange-300"
        >
          Voir tous les modèles
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.slice(0, 6).map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onClick={() => navigate(`/products/${p._id}`)}
          />
        ))}
        {products.length === 0 && (
          <p className="text-xs text-zinc-500">
            Aucun produit pour l&apos;instant
          </p>
        )}
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black pb-10">
      {hero}
      {grid}
    </main>
  );
}
