import mongoose from 'mongoose';

export async function connectDatabase() {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error("❌ MONGODB_URI est undefined. Vérifie ton fichier .env !");
        }

        await mongoose.connect(uri);

        console.log("✅ Connecté à MongoDB !");
    } catch (err) {
        console.error("❌ Erreur de connexion MongoDB :", err.message);
        process.exit(1);
    }
}
