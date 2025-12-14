// Middleware générique de validation très simple (par champs obligatoires)

export function validateBody(requiredFields = []) {
  return (req, res, next) => {
    const missing = [];

    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        message: 'Champs manquants ou invalides',
        fields: missing,
      });
    }

    next();
  };
}
