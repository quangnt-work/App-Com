'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook wrapping the browser SpeechSynthesis API.
 * Handles the async voice loading issue in Chrome and selects a Russian voice automatically.
 */
export function useSpeechSynthesisHook(lang: string = 'ru-RU') {
  const [voicesReady, setVoicesReady] = useState(false);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices — Chrome fires 'voiceschanged' asynchronously
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;

      // Try to find the best Russian voice
      const russianVoice =
        voices.find(v => v.lang === lang && v.localService) || // Prefer local/offline voice
        voices.find(v => v.lang === lang) ||                    // Any exact match
        voices.find(v => v.lang.startsWith('ru')) ||            // Fallback: any Russian
        null;

      selectedVoiceRef.current = russianVoice;
      setVoicesReady(true);
    };

    // Try immediately (Firefox loads voices synchronously)
    loadVoices();

    // Chrome loads voices async — listen for the event
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [lang]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /** Stop any ongoing speech and clear intervals */
  const cancel = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    window.speechSynthesis.cancel();
  }, []);

  /**
   * Speak a given text string using the selected Russian voice.
   * Handles Chrome's "stuck" SpeechSynthesis bug by cancelling before speaking.
   */
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel any ongoing speech first (fixes Chrome stuck bug)
    cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for learners

    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }

    // Chrome bug workaround: speechSynthesis sometimes pauses after ~15s.
    // Resume it periodically while speaking, but only for long texts.
    if (text.length > 200) {
      intervalRef.current = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 10000); // 10s is safe before the 15s limit
    }

    utterance.onend = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    utterance.onerror = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [lang, cancel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  return { speak, cancel, voicesReady };
}
