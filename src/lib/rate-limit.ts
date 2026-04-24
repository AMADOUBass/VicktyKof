// Rate limiter in-memory — suffisant pour un salon à faible trafic.
// Pour un déploiement multi-instance à fort trafic, migrer vers Upstash Redis.

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

// Retourne true si la requête est autorisée, false si bloquée.
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}

// Nettoie les entrées expirées toutes les 5 minutes pour éviter les fuites mémoire
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);
