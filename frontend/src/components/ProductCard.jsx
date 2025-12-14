export default function ProductCard({ product, onClick }) {
    const outOfStock = product.stock === 0;

    return (
        <button
            onClick={onClick}
            disabled={outOfStock}
            className={`group bg-zinc-900 rounded-3xl overflow-hidden border flex flex-col text-left transition 
                ${outOfStock ? "opacity-50 cursor-not-allowed" : "hover:border-orange-500"}
                border-zinc-800`}
        >
            {/* IMAGE */}
            <div className="relative h-48 bg-gradient-to-tr from-zinc-800 to-zinc-900 flex items-center justify-center">
                <div className="w-40 h-24 bg-zinc-950 rounded-3xl rotate-[-12deg] shadow-xl flex items-center justify-center overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                    />
                </div>

                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    {product.category}
                </span>

                <span
                    className={`absolute bottom-3 right-3 text-[11px] px-2 py-0.5 rounded-full border
                    ${outOfStock ? "bg-red-600/40 border-red-700 text-red-200"
                        : "bg-black/60 border-zinc-700 text-zinc-200"}`}
                >
                    {outOfStock ? "Rupture" : "Disponible"}
                </span>
            </div>

            {/* INFOS */}
            <div className="p-4 flex-1 flex flex-col gap-1">
                <h3 className="font-semibold text-sm text-white line-clamp-1">
                    {product.name}
                </h3>

                <p className="text-[11px] text-zinc-400 line-clamp-2">
                    {product.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-base font-semibold text-orange-400">
                        {product.price.toFixed(2)} €
                    </span>

                    <span className="text-[11px] text-zinc-500">
                        Stock : {product.stock}
                    </span>
                </div>
            </div>
        </button>
    );
}
