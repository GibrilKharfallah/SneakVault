export function errorHandler(err, req, res, next) {
    console.error('Erreur serveur :', err);

    const status = err.status || 500;

    res.status(status).json({
        message: err.message || 'Erreur interne du serveur',
    });
}
