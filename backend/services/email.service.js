/**
 * Service d'email simplifié pour le projet.
 * Ici, on se contente de faire des console.log.
 * Dans un vrai projet, on utiliserait Nodemailer, SendGrid, Mailjet, etc.
 */

export async function sendOrderConfirmationEmail({ userId, order }) {
    console.log(
        `[EMAIL] Confirmation de commande envoyée à user=${userId}, order=${order._id}`
    );
}

export async function sendPaymentConfirmationEmail({ userId, order, payment }) {
    console.log(
        `[EMAIL] Paiement réussi envoyé à user=${userId}, order=${order._id}, payment=${payment._id}`
    );
}

export async function sendDeliveryStatusEmail({ userId, delivery }) {
    console.log(
        `[EMAIL] Mise à jour livraison envoyée à user=${userId}, delivery=${delivery._id}, status=${delivery.status}`
    );
}
