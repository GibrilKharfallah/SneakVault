import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss';

export const sanitizeMongoPayload = mongoSanitize({
    allowDots: false,
    replaceWith: '_',
});

function containsNoSqlOperators(value) {
    if (value === null || typeof value !== 'object') {
        return false;
    }

    if (Array.isArray(value)) {
        return value.some(containsNoSqlOperators);
    }

    return Object.keys(value).some((key) => {
        if (key.startsWith('$') || key.includes('.')) {
            return true;
        }
        return containsNoSqlOperators(value[key]);
    });
}

export function rejectNoSqlOperators(req, res, next) {
    if (
        containsNoSqlOperators(req.body) ||
        containsNoSqlOperators(req.query) ||
        containsNoSqlOperators(req.params)
    ) {
        return res
            .status(400)
            .json({ message: 'Requête invalide: opérateurs NoSQL interdits.' });
    }

    return next();
}

const xssOptions = {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'iframe', 'style'],
};

function sanitizeValue(value) {
    if (value === null || value === undefined) {
        return value;
    }

    if (typeof value === 'string') {
        return xss(value, xssOptions);
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (typeof value === 'object') {
        const sanitized = {};
        for (const [k, v] of Object.entries(value)) {
            sanitized[k] = sanitizeValue(v);
        }
        return sanitized;
    }

    return value;
}

export function sanitizeXssPayload(req, _res, next) {
    req.body = sanitizeValue(req.body);
    req.query = sanitizeValue(req.query);
    req.params = sanitizeValue(req.params);
    return next();
}
