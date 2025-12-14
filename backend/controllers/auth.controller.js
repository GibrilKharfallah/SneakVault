import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

/**
 *  INSCRIPTION
 */
export const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email et mot de passe requis" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Utilisateur déjà existant" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            passwordHash,
            firstName: firstName || "",
            lastName: lastName || "",
            role: "USER",
        });

        const token = jwt.sign(
            { id: user._id.toString(), email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Erreur register:", err);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 *  CONNEXION
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        const token = jwt.sign(
            { id: user._id.toString(), email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Erreur login:", err);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
