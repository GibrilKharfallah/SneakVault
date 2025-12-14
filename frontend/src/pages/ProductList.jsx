import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-white">
            Toutes les chaussures
          </h1>
          <p className="text-[11px] text-zinc-500">
            Résultats : {products.length}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onClick={() => navigate(`/products/${p._id}`)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
