import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-change"));
        navigate("/login");
    };

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <header className="border-b border-gray-900 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-300" />
            <span className="font-semibold tracking-tight text-lg">
                <span className="text-white">SneakVault</span>
            </span>
            </Link>

            <div className="hidden sm:flex items-center gap-4 text-sm">
            <Link
                to="/products"
                className={`hover:text-orange-400 transition ${
                isActive("/products") ? "text-orange-400" : "text-gray-200"
                }`}
            >
                Nouveautés
            </Link>

            <Link
                to="/recommendations"
                className={`hover:text-orange-400 transition ${
                isActive("/recommendations") ? "text-orange-400" : "text-gray-200"
                }`}
            >
                Recommendation
            </Link>

            <Link
                to="/cart"
                className={`hover:text-orange-400 transition ${
                isActive("/cart") ? "text-orange-400" : "text-gray-200"
                }`}
            >
                Panier
            </Link>

            <Link
                to="/orders"
                className={`hover:text-orange-400 transition ${
                isActive("/orders") ? "text-orange-400" : "text-gray-200"
                }`}
            >
                Commandes
            </Link>

            {user.role === "ADMIN" && (
                <Link
                to="/admin"
                className={`hover:text-orange-400 transition ${
                    isActive("/admin") ? "text-orange-400" : "text-red-400"
                }`}
                >
                Admin Panel
                </Link>
            )}
            </div>

            <div className="flex items-center gap-3 text-xs">
            {token && (
                <span className="hidden sm:block text-gray-400">{user.email}</span>
            )}

            {token ? (
                <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-full border border-gray-700 hover:border-orange-400 hover:text-orange-400 text-xs font-medium transition"
                >
                Logout
                </button>
            ) : (
                <button
                onClick={() => navigate("/login")}
                className="px-3 py-1 rounded-full bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition"
                >
                Se connecter
                </button>
            )}
            </div>
        </nav>
        </header>
    );
}
