/**
 * Generate unique identifier
 * Uses timestamp + random component for uniqueness
 * @param prefix - Optional prefix for the ID (e.g., "routine", "exercise", "session")
 * @returns Unique ID string
 */
export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36); // Base36 encoding
  const randomPart = Math.random().toString(36).substring(2, 9); // Random 7 chars
  
  const id = `${timestamp}_${randomPart}`;
  
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Generate UUID v4 (more robust unique ID)
 * Fallback implementation if crypto.randomUUID is not available
 * @returns UUID string
 */
export function generateUUID(): string {
  // Use native crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback UUID v4 implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
