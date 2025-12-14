import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

export function authRequired(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    const token = header.split(' ')[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        req.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role || 'USER',
        };

        next();
    } catch {
        return res.status(401).json({ message: 'Token invalide' });
    }
}

// Middleware générique pour restreindre par rôle
export function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentification requise' });
        }
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Accès refusé (rôle insuffisant)' });
        }
        next();
    };
}

// Middleware spécifique ADMIN pour éviter d'écrire requireRole partout
export const adminOnly = requireRole('ADMIN');
