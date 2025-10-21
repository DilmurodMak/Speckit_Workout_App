/**
 * Audio service for timer notifications
 * Uses Web Audio API for low-latency playback with MP3 files
 */

import { DEFAULT_AUDIO_VOLUME } from '../utils/constants';

// Use HTML5 Audio for simple playback
let beepAudio: HTMLAudioElement | null = null;
let completeAudio: HTMLAudioElement | null = null;
let isInitialized = false;

/**
 * Initialize Audio (must be called after user interaction)
 */
export async function initializeAudio(): Promise<void> {
  if (isInitialized) return;
  
  try {
    // Create audio elements
    beepAudio = new Audio('/sounds/beep.mp3');
    completeAudio = new Audio('/sounds/complete.mp3');
    
    // Preload the audio files
    beepAudio.preload = 'auto';
    completeAudio.preload = 'auto';
    
    // Set initial volume
    beepAudio.volume = DEFAULT_AUDIO_VOLUME;
    completeAudio.volume = DEFAULT_AUDIO_VOLUME;
    
    isInitialized = true;
    console.log('Audio initialized successfully');
  } catch (error) {
    console.error('Failed to initialize audio:', error);
  }
}

/**
 * Play beep sound for transitions
 */
export function playBeep(volume: number = DEFAULT_AUDIO_VOLUME): void {
  try {
    if (!isInitialized || !beepAudio) {
      console.warn('Audio not initialized - call initializeAudio() first');
      return;
    }
    
    // Reset audio to beginning and set volume
    beepAudio.currentTime = 0;
    beepAudio.volume = volume;
    
    // Play the audio
    const playPromise = beepAudio.play();
    
    // Handle play promise (required for some browsers)
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Audio play failed:', error);
      });
    }
  } catch (error) {
    console.error('Error playing beep:', error);
  }
}

/**
 * Play completion sound
 */
export function playComplete(volume: number = DEFAULT_AUDIO_VOLUME): void {
  try {
    if (!isInitialized || !completeAudio) {
      console.warn('Audio not initialized - call initializeAudio() first');
      return;
    }
    
    // Reset audio to beginning and set volume
    completeAudio.currentTime = 0;
    completeAudio.volume = volume;
    
    // Play the audio
    const playPromise = completeAudio.play();
    
    // Handle play promise (required for some browsers)
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Audio play failed:', error);
      });
    }
  } catch (error) {
    console.error('Error playing complete sound:', error);
  }
}
