export function logInfo(message, meta = {}) {
  console.log('[INFO]', message, meta);
}

export function logError(message, meta = {}) {
  console.error('[ERROR]', message, meta);
}
