export function rateLimit(limit: number, windowMs: number) {
  const ipStore = new Map<string, { count: number; resetTime: number }>();

  return function (ip: string) {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Cleanup expired entries
    for (const [key, value] of ipStore.entries()) {
      if (value.resetTime < windowStart) {
        ipStore.delete(key);
      }
    }

    let record = ipStore.get(ip);
    
    if (!record) {
      record = { count: 1, resetTime: now };
      ipStore.set(ip, record);
      return { success: true };
    }

    if (record.count >= limit) {
      return { success: false };
    }

    record.count += 1;
    return { success: true };
  };
}
