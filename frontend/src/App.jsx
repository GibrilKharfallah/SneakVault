import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProductList from "./pages/ProductList.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import TrackDelivery from "./pages/TrackDelivery.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminDeliveries from "./pages/admin/AdminDeliveries.jsx";

export default function App() {
    const location = useLocation();
    const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem("token"));

    useEffect(() => {
        const handler = () => setIsAuth(!!localStorage.getItem("token"));
        window.addEventListener("auth-change", handler);
        window.addEventListener("storage", handler);
        return () => {
        window.removeEventListener("auth-change", handler);
        window.removeEventListener("storage", handler);
        };
    }, []);

    useEffect(() => {
        setIsAuth(!!localStorage.getItem("token"));
    }, [location]);

    return (
        <div className="min-h-screen bg-black text-white">
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/register" element={isAuth ? <Home /> : <Register />} />

            <Route
            path="/products"
            element={
                <ProtectedRoute>
                <ProductList />
                </ProtectedRoute>
            }
            />

            <Route
            path="/products/:id"
            element={
                <ProtectedRoute>
                <ProductPage />
                </ProtectedRoute>
            }
            />

            <Route
            path="/cart"
            element={
                <ProtectedRoute>
                <Cart />
                </ProtectedRoute>
            }
            />

            <Route
            path="/checkout"
            element={
                <ProtectedRoute>
                <Checkout />
                </ProtectedRoute>
            }
            />

            <Route
            path="/orders"
            element={
                <ProtectedRoute>
                <Orders />
                </ProtectedRoute>
            }
            />

            <Route
            path="/delivery/:orderId"
            element={
                <ProtectedRoute>
                <TrackDelivery />
                </ProtectedRoute>
            }
            />

            <Route
            path="/recommendations"
            element={
                <ProtectedRoute>
                <Recommendations />
                </ProtectedRoute>
            }
            />

            <Route
            path="/admin"
            element={
                <ProtectedRoute role="ADMIN">
                <AdminDashboard />
                </ProtectedRoute>
            }
            />

            <Route
            path="/admin/products"
            element={
                <ProtectedRoute role="ADMIN">
                <AdminProducts />
                </ProtectedRoute>
            }
            />

            <Route
            path="/admin/orders"
            element={
                <ProtectedRoute role="ADMIN">
                <AdminOrders />
                </ProtectedRoute>
            }
            />

            <Route
            path="/admin/users"
            element={
                <ProtectedRoute role="ADMIN">
                <AdminUsers />
                </ProtectedRoute>
            }
            />

            <Route
            path="/admin/deliveries"
            element={
                <ProtectedRoute role="ADMIN">
                <AdminDeliveries />
                </ProtectedRoute>
            }
            />
        </Routes>
        </div>
    );
}
