/**
 * Shared Text-to-Speech utility for Russian language audio playback.
 * Upgraded to use Edge TTS (/api/tts) for native-like pronunciation.
 */

let currentAudio: HTMLAudioElement | null = null;
let currentObjectUrl: string | null = null;
let currentSpeechToken = 0;

// Bộ nhớ đệm in-memory cho âm thanh Edge-TTS (giữ tối đa 100 audio blobs)
const audioBlobCache = new Map<string, Blob>();
const MAX_CACHE_SIZE = 100;

export function cancelSpeech(): void {
  currentSpeechToken++; // Vô hiệu hóa các tiến trình fetch/play cũ đang chờ
  window.speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
}

export async function speakRussian(text: string, rate: number = 1.0): Promise<void> {
  // Cancel previous speech
  cancelSpeech();
  const token = currentSpeechToken;
  const cleanText = text.trim();
  const cacheKey = `${cleanText}_${rate.toFixed(2)}`;

  try {
    let blob = audioBlobCache.get(cacheKey);

    if (!blob) {
      // Edge-TTS rate string format (e.g. "+0%" or "+20%")
      const edgeRate = rate >= 1 
         ? `+${Math.round((rate - 1) * 100)}%` 
         : `${Math.round((rate - 1) * 100)}%`;

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, rate: edgeRate, voice: 'ru-RU-DmitryNeural' })
      });
      
      if (token !== currentSpeechToken) return; // Bị hủy do có yêu cầu mới
      if (!res.ok) throw new Error('TTS failed');
      
      blob = await res.blob();
      if (token !== currentSpeechToken) return;

      // LRU eviction: xóa phần tử đầu tiên nếu vượt kích thước
      if (audioBlobCache.size >= MAX_CACHE_SIZE) {
        const firstKey = audioBlobCache.keys().next().value;
        if (firstKey) audioBlobCache.delete(firstKey);
      }
      audioBlobCache.set(cacheKey, blob);
    }

    const url = URL.createObjectURL(blob);
    currentObjectUrl = url;
    currentAudio = new Audio(url);
    
    currentAudio.onended = () => {
      if (currentObjectUrl === url) {
        URL.revokeObjectURL(url);
        currentObjectUrl = null;
      }
    };
    
    await currentAudio.play();
  } catch (error: any) {
    if (token !== currentSpeechToken) return; // Bị hủy do có yêu cầu mới
    if (error.name === 'AbortError' || error.name === 'NotAllowedError') {
      console.warn("Audio bị chặn hoặc hủy (Edge TTS):", error.name);
      return; // Không fallback nếu người dùng tự hủy hoặc trình duyệt chặn
    }

    console.error("Lỗi khi phát audio (Edge TTS):", error);
    // Fallback browser native TTS
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }
}
