export function requireAuth(resolver) {
    return (parent, args, context, info) => {
        if (!context.user) {
        throw new Error('Authentification requise');
        }
        return resolver(parent, args, context, info);
    };
}

export function requireRole(role) {
    return (resolver) => {
        return (parent, args, context, info) => {
        if (!context.user) {
            throw new Error('Authentification requise');
        }
        if (context.user.role !== role) {
            throw new Error('Accès refusé');
        }
        return resolver(parent, args, context, info);
        };
    };
}
