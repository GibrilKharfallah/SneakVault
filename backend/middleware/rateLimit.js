// Rate limiting très simple: max X requêtes par IP dans une fenêtre donnée

const windows = new Map();

function rateLimit({ windowMs, maxRequests }) {
    return (req, res, next) => {
        const key = `${req.ip}-${req.originalUrl}`;
        const now = Date.now();
        const window = windows.get(key);

        if (!window) {
        windows.set(key, { count: 1, start: now });
        return next();
        }

        if (now - window.start > windowMs) {
        windows.set(key, { count: 1, start: now });
        return next();
        }

        if (window.count >= maxRequests) {
        return res
            .status(429)
            .json({ message: 'Trop de requêtes, veuillez réessayer plus tard.' });
        }

        window.count += 1;
        windows.set(key, window);
        next();
    };
}

// Limiter les paiements (10 requêtes / minute / IP)
export const paymentRateLimit = rateLimit({
    windowMs: 60_000,
    maxRequests: 10,
});
