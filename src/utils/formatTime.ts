/**
 * Format seconds to MM:SS display format
 * @param seconds - Total seconds to format
 * @returns Formatted time string (e.g., "05:30", "12:45")
 */
export function formatTime(seconds: number): string {
  // Handle negative values
  const absSeconds = Math.abs(Math.floor(seconds));
  
  const minutes = Math.floor(absSeconds / 60);
  const remainingSeconds = absSeconds % 60;
  
  // Pad with leading zeros
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return `${paddedMinutes}:${paddedSeconds}`;
}

/**
 * Parse MM:SS format string to seconds
 * @param timeString - Time string in MM:SS format
 * @returns Total seconds, or null if invalid format
 */
export function parseTimeString(timeString: string): number | null {
  const match = timeString.match(/^(\d{1,2}):(\d{2})$/);
  
  if (!match) {
    return null;
  }
  
  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  
  if (seconds >= 60) {
    return null;
  }
  
  return minutes * 60 + seconds;
}

/**
 * Format seconds to human-readable duration
 * @param seconds - Total seconds
 * @returns Human-readable string (e.g., "5m 30s", "1h 15m")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts: string[] = [];
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`);
  }
  
  return parts.join(' ');
}
