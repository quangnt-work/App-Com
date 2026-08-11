/**
 * Shared Text-to-Speech utility for Russian language audio playback.
 * Used by RoleplayMessage component and Roleplay room page.
 */
export function speakRussian(text: string, rate: number = 1.0): void {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ru-RU';
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

export function cancelSpeech(): void {
  window.speechSynthesis.cancel();
}
