import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from "@google/genai";

// Parse keys from both GEMINI_API_KEY and GEMINI_API_KEYS, deduplicating
const envKey = process.env.GEMINI_API_KEY ? [process.env.GEMINI_API_KEY.trim()] : [];
const envKeys = (process.env.GEMINI_API_KEYS || "").split(",").map(k => k.trim()).filter(Boolean);
const API_KEYS = Array.from(new Set([...envKey, ...envKeys]));

if (API_KEYS.length === 0) {
  console.warn("WARNING: No GEMINI_API_KEYS or GEMINI_API_KEY found in environment variables.");
}

// Start with a random key to distribute load immediately on server start
let currentKeyIndex = Math.floor(Math.random() * Math.max(1, API_KEYS.length));

// Rotate key using Round-Robin
function getNextApiKey(): string {
  if (API_KEYS.length === 0) return "";
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

// Model Fallback chains tailored to available AI Studio quotas
export const AUDIO_MODELS_FALLBACK = [
  "gemini-flash-lite-latest",
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
];

export const TEXT_MODELS_FALLBACK = [
  "gemma-4-31b-it",
  "gemma-4-26b-a4b-it",
  "gemini-flash-lite-latest",
];

/**
 * Wrapper for generating content with Gemini.
 * It automatically rotates API keys and falls back across specified models if 429/503 errors occur.
 */
export async function generateContentWithFallback(
  params: Omit<GenerateContentParameters, "model">, 
  preferredModelOrModels: string | string[] = "gemini-flash-lite-latest",
  maxRetries: number = 4
): Promise<GenerateContentResponse> {
  
  const modelsToTry = Array.isArray(preferredModelOrModels) 
    ? preferredModelOrModels 
    : [preferredModelOrModels, ...AUDIO_MODELS_FALLBACK.filter(m => m !== preferredModelOrModels)];

  let attempts = 0;
  let lastError: any = null;

  while (attempts < maxRetries) {
    const apiKey = getNextApiKey();
    const modelToUse = modelsToTry[Math.min(attempts, modelsToTry.length - 1)];
    
    try {
      const gemini = new GoogleGenAI({ apiKey });
      const response = await gemini.models.generateContent({
        ...params,
        model: modelToUse
      });
      return response;
    } catch (error: any) {
      lastError = error;
      const status = error?.status || error?.response?.status;
      const errorString = error?.message?.toLowerCase() || JSON.stringify(error).toLowerCase();
      
      // Check for Rate Limit (429), Quota Exhausted, or Service Unavailable (503/High Demand)
      if (
        status === 429 || 
        status === 503 || 
        errorString.includes("429") || 
        errorString.includes("503") || 
        errorString.includes("quota") || 
        errorString.includes("high demand") ||
        errorString.includes("temporarily unavailable")
      ) {
        console.warn(`[Gemini Fallback] Attempt ${attempts + 1} failed with model ${modelToUse} (Key Index: ${currentKeyIndex === 0 ? API_KEYS.length - 1 : currentKeyIndex - 1}). Retrying with next model/key...`);
        attempts++;
        // Exponential backoff delay (600ms, 1200ms, 2400ms...)
        const delay = 600 * Math.pow(2, attempts - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If it's another error (e.g. 400 Bad Request, safety), log and re-throw
      throw error;
    }
  }

  throw new Error(`Gemini API Error after ${maxRetries} attempts: ${lastError?.message || lastError}`);
}

/**
 * Utility function to securely parse JSON from AI responses.
 * Uses Regex to extract the JSON block and strips markdown fences.
 */
export function parseAIResponse<T = any>(text: string | null | undefined, fallbackDefault: T | null = null): T {
  if (!text) {
    if (fallbackDefault !== null) return fallbackDefault;
    throw new Error("AI không trả về nội dung.");
  }
  
  let cleanText = text.trim();
  // Strip ```json and ``` if present
  cleanText = cleanText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```$/, "").trim();
  
  const jsonMatch = cleanText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  
  if (!jsonMatch) {
    console.error("Lỗi Parse JSON từ AI - Không tìm thấy định dạng JSON:", cleanText);
    if (fallbackDefault !== null) return fallbackDefault;
    throw new Error("AI trả về dữ liệu không hợp lệ, không thể phân tích.");
  }

  try {
    return JSON.parse(jsonMatch[0]) as T;
  } catch (_error) {
    console.error("Lỗi Parse JSON từ AI:", jsonMatch[0]);
    if (fallbackDefault !== null) return fallbackDefault;
    throw new Error("AI trả về dữ liệu không hợp lệ, không thể phân tích.");
  }
}

