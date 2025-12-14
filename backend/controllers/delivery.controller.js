import { Delivery } from "../models/Delivery.model.js";

/**
 * GET /api/deliveries
 * Liste de toutes les livraisons (ADMIN uniquement)
 */
export const getAllDeliveries = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {};
        if (status && status !== "ALL") {
            filter.status = status;
        }

        const deliveries = await Delivery.find(filter)
            .populate("order")
            .populate("user")
            .sort({ createdAt: -1 });

        res.json(deliveries);
    } catch (err) {
        console.error("Erreur getAllDeliveries:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 * GET /api/deliveries/order/:orderId
 * Récupère la livraison liée à une commande (côté utilisateur)
 */
export const getDeliveryByOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const delivery = await Delivery.findOne({
            order: orderId,
            user: req.user.id,
        });

        if (!delivery) {
            return res.status(404).json({ message: "Livraison non trouvée" });
        }

        res.json(delivery);
    } catch (err) {
        console.error("Erreur getDeliveryByOrder:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 * GET /api/deliveries/:id
 * Récupération directe d'une livraison (si tu en as besoin côté user)
 */
export const getDeliveryById = async (req, res) => {
    try {
        const delivery = await Delivery.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!delivery) {
            return res.status(404).json({ message: "Livraison introuvable." });
        }

        res.json(delivery);
    } catch (err) {
        console.error("Erreur getDeliveryById:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 * PATCH /api/deliveries/:id/status
 * Mise à jour du statut et du tracking (ADMIN)
 */
export const updateDeliveryStatus = async (req, res) => {
    try {
        const { status, trackingNumber } = req.body;

        const delivery = await Delivery.findById(req.params.id);
        if (!delivery) {
            return res.status(404).json({ message: "Livraison non trouvée" });
        }

        if (status) delivery.status = status;
        if (trackingNumber) delivery.trackingNumber = trackingNumber;

        await delivery.save();

        res.json(delivery);
    } catch (err) {
        console.error("Erreur updateDeliveryStatus:", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
