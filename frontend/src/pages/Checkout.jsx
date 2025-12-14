import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

export default function Checkout() {
    const navigate = useNavigate();
    const [address, setAddress] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        postalCode: "",
    });
    const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
    const [billingAddress, setBillingAddress] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        postalCode: "",
    });
    const [card, setCard] = useState({
        number: "",
        expiry: "",
        cvc: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAddressChange = (setter) => (e) => {
        setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    };

    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);
        if (digits.length < 3) return digits;
        return digits.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        if (name === "number") {
            setCard((prev) => ({ ...prev, number: formatCardNumber(value) }));
        } else if (name === "expiry") {
            setCard((prev) => ({ ...prev, expiry: formatExpiry(value) }));
        } else {
            setCard((prev) => ({ ...prev, [name]: value.replace(/\D/g, "").slice(0, 3) }));
        }
    };

    const validateBillingAddress = (billing) => {
        if (!billing.addressLine1 || !billing.city || !billing.postalCode) {
            setError("Veuillez fournir une adresse de facturation complète.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const strippedNumber = card.number.replace(/\s+/g, "");
        if (!/^\d{16}$/.test(strippedNumber)) {
            setLoading(false);
            return setError("Le numéro de carte doit comporter 16 chiffres.");
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) {
            setLoading(false);
            return setError("La date d'expiration doit être au format MM/YY.");
        }
        if (!/^\d{3}$/.test(card.cvc)) {
            setLoading(false);
            return setError("Le CVC doit comporter 3 chiffres.");
        }

        const [expMonth, expYearShort] = card.expiry.split("/");
        const expiryMonth = expMonth;
        const expiryYear = `20${expYearShort}`;

        const selectedBilling = useShippingAsBilling ? address : billingAddress;
        if (!validateBillingAddress(selectedBilling)) {
            setLoading(false);
            return;
        }

        try {
            const orderRes = await api.post("/orders", address);
            await api.post("/payments", {
                orderId: orderRes.data.order._id,
                amount: orderRes.data.order.totalAmount,
                method: "CARD",
                cardNumber: strippedNumber,
                expiryMonth,
                expiryYear,
                cvc: card.cvc,
                billingAddress: selectedBilling,
            });
            navigate("/orders");
        } catch (err) {
            console.error(err);
            setError("Impossible de créer la commande.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black">
            <section className="max-w-lg mx-auto px-4 py-8">
                <h1 className="text-xl font-semibold text-white mb-4">
                    Finaliser la commande
                </h1>
                <p className="text-xs text-zinc-400 mb-4">
                    Adresse de livraison &amp; paiement mocké (API /orders + /payments).
                </p>

                {error && (
                    <p className="mb-3 text-xs text-red-400 bg-red-950/40 px-3 py-2 rounded-xl border border-red-900">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <h2 className="text-sm font-semibold text-white">Adresse de livraison</h2>
                    <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">
                            Adresse (ligne 1)
                        </label>
                        <input
                            name="addressLine1"
                            value={address.addressLine1}
                            onChange={handleAddressChange(setAddress)}
                            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">
                            Adresse (ligne 2)
                        </label>
                        <input
                            name="addressLine2"
                            value={address.addressLine2}
                            onChange={handleAddressChange(setAddress)}
                            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">
                                Code postal
                            </label>
                            <input
                                name="postalCode"
                                value={address.postalCode}
                                onChange={handleAddressChange(setAddress)}
                                className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">
                                Ville
                            </label>
                            <input
                                name="city"
                                value={address.city}
                                onChange={handleAddressChange(setAddress)}
                                className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-zinc-800 mt-6">
                        <h2 className="text-sm font-semibold text-white">
                            Paiement mocké
                        </h2>

                        <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">
                                Numéro de carte
                            </label>
                            <input
                                name="number"
                                value={card.number}
                                onChange={handleCardChange}
                                inputMode="numeric"
                                autoComplete="cc-number"
                                placeholder="Numéro de carte"
                                className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] text-zinc-400 mb-1">
                                    Expiration (MM/YY)
                                </label>
                                <input
                                    name="expiry"
                                    value={card.expiry}
                                    onChange={handleCardChange}
                                    inputMode="numeric"
                                    autoComplete="cc-exp"
                                    placeholder="MM/YY"
                                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] text-zinc-400 mb-1">
                                    CVC
                                </label>
                                <input
                                    name="cvc"
                                    value={card.cvc}
                                    onChange={handleCardChange}
                                    inputMode="numeric"
                                    autoComplete="cc-csc"
                                    placeholder="CVC"
                                    className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-zinc-800 mt-6">
                        <div className="flex items-center gap-2">
                            <input
                                id="sameAddress"
                                type="checkbox"
                                checked={useShippingAsBilling}
                                onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                                className="h-4 w-4 accent-orange-400"
                            />
                            <label htmlFor="sameAddress" className="text-xs text-zinc-300">
                                Utiliser la même adresse pour la facturation
                            </label>
                        </div>

                        {!useShippingAsBilling && (
                            <>
                                <h2 className="text-sm font-semibold text-white">
                                    Adresse de facturation
                                </h2>
                                <div>
                                    <label className="block text-[11px] text-zinc-400 mb-1">
                                        Adresse (ligne 1)
                                    </label>
                                    <input
                                        name="addressLine1"
                                        value={billingAddress.addressLine1}
                                        onChange={handleAddressChange(setBillingAddress)}
                                        className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] text-zinc-400 mb-1">
                                        Adresse (ligne 2)
                                    </label>
                                    <input
                                        name="addressLine2"
                                        value={billingAddress.addressLine2}
                                        onChange={handleAddressChange(setBillingAddress)}
                                        className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] text-zinc-400 mb-1">
                                            Code postal
                                        </label>
                                        <input
                                            name="postalCode"
                                            value={billingAddress.postalCode}
                                            onChange={handleAddressChange(setBillingAddress)}
                                            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] text-zinc-400 mb-1">
                                            Ville
                                        </label>
                                        <input
                                            name="city"
                                            value={billingAddress.city}
                                            onChange={handleAddressChange(setBillingAddress)}
                                            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-400"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 rounded-xl bg-white text-black text-sm font-semibold py-2 hover:bg-zinc-100 transition disabled:opacity-60"
                    >
                        {loading
                            ? "Création de la commande..."
                            : "Payer & commander"}
                    </button>
                </form>
            </section>
        </main>
    );
}
