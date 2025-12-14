import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

export async function buildContext({ req }) {
    const auth = req.headers.authorization || '';
    let user = null;

    if (auth.startsWith('Bearer ')) {
        const token = auth.split(' ')[1];
        try {
        const payload = jwt.verify(token, JWT_SECRET);
        user = {
            id: payload.id,
            email: payload.email,
            role: payload.role || 'USER',
        };
        } catch (e) {
        // token invalide : user = null
        }
    }

    return { user };
}
