import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionHook {
  isRecording: boolean;
  transcript: string;
  interimTranscript: string;
  startRecording: () => void;
  stopRecording: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  error: string | null;
}

export function useSpeechRecognition(lang: string = 'ru-RU'): SpeechRecognitionHook {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Continue recording even if user pauses
      recognition.interimResults = true; // Show results while speaking
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsRecording(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let final = '';
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setTranscript((prev) => (prev ? prev + ' ' + final : final));
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          // Ignore no-speech errors which happen naturally
          return;
        }
        console.error('Speech recognition error', event.error);
        setError(`Lỗi ghi âm: ${event.error}`);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [lang]);

  const startRecording = useCallback(() => {
    if (!isSupported) {
      setError('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.');
      return;
    }
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    try {
      recognitionRef.current?.start();
    } catch (err) {
      console.error('Could not start recognition', err);
    }
  }, [isSupported]);

  const stopRecording = useCallback(() => {
    if (!isSupported) return;
    try {
      recognitionRef.current?.stop();
    } catch (err) {
      console.error('Could not stop recognition', err);
    }
  }, [isSupported]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isRecording,
    transcript,
    interimTranscript,
    startRecording,
    stopRecording,
    resetTranscript,
    isSupported,
    error
  };
}
