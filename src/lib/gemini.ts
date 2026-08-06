import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from "@google/genai";

// Parse keys from environment variables
const keysStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
const API_KEYS = keysStr.split(',').map(k => k.trim()).filter(k => k.length > 0);

if (API_KEYS.length === 0) {
  console.warn("WARNING: No GEMINI_API_KEYS found in environment variables.");
}

// Start with a random key to distribute load immediately on server start
let currentKeyIndex = Math.floor(Math.random() * Math.max(1, API_KEYS.length));

// Rotate key using Round-Robin
function getNextApiKey() {
  if (API_KEYS.length === 0) return "";
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

// Fallback chain in case the primary model is busy/rate-limited
const FALLBACK_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.5-flash"
];

/**
 * Wrapper for generating content with Gemini.
 * It automatically rotates API keys and falls back to other models if 429/503 errors occur.
 */
export async function generateContentWithFallback(
  params: Omit<GenerateContentParameters, "model">, 
  preferredModel: string = "gemini-3.1-flash-lite",
  maxRetries: number = 3
): Promise<GenerateContentResponse> {
  
  let attempts = 0;
  // Ensure the preferred model is tried first, then fallbacks
  let modelsToTry = [preferredModel, ...FALLBACK_MODELS.filter(m => m !== preferredModel)];
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
      if (status === 429 || status === 503 || errorString.includes("429") || errorString.includes("503") || errorString.includes("quota") || errorString.includes("high demand")) {
        console.warn(`[Gemini Fallback] Attempt ${attempts + 1} failed with model ${modelToUse} (Key Index: ${currentKeyIndex === 0 ? API_KEYS.length - 1 : currentKeyIndex - 1}). Retrying...`);
        attempts++;
        // Exponential backoff delay (1000ms, 2000ms, 4000ms...)
        const delay = 1000 * Math.pow(2, attempts - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If it's a structural error (e.g., 400 Bad Request, safety violation), throw immediately without retrying
      throw error;
    }
  }

  throw new Error(`Gemini API Error after ${maxRetries} attempts: ${lastError?.message || lastError}`);
}

/**
 * Utility function to securely parse JSON from AI responses.
 * Uses Regex to extract the JSON block.
 */
export function parseAIResponse<T = any>(text: string | null | undefined, fallbackDefault: T | null = null): T {
  if (!text) {
    if (fallbackDefault !== null) return fallbackDefault;
    throw new Error("AI không trả về nội dung.");
  }
  
  const cleanText = text.trim();
  const jsonMatch = cleanText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  
  if (!jsonMatch) {
    console.error("Lỗi Parse JSON từ AI - Không tìm thấy định dạng JSON:", cleanText);
    throw new Error("AI trả về dữ liệu không hợp lệ, không thể phân tích.");
  }

  try {
    return JSON.parse(jsonMatch[0]) as T;
  } catch (error) {
    console.error("Lỗi Parse JSON từ AI:", jsonMatch[0]);
    throw new Error("AI trả về dữ liệu không hợp lệ, không thể phân tích.");
  }
}
