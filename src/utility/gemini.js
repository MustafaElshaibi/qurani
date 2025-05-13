// gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_REACT_APP_GEMINI_KEY);

// Cache configuration (1 hour expiration)
const CACHE_EXPIRATION_MS = 60 * 60 * 1000; 
const CACHE_KEY_PREFIX = "reciter_cache_";

// Get cached data
const getCachedData = (reciterName) => {
  const cacheKey = CACHE_KEY_PREFIX + reciterName;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (!cachedData) return null;

  const { timestamp, data } = JSON.parse(cachedData);
  
  if (Date.now() - timestamp < CACHE_EXPIRATION_MS) {
    return data;
  }
  
  // Clear expired cache
  localStorage.removeItem(cacheKey);
  return null;
};

// Store data in cache
const setCachedData = (reciterName, data) => {
  const cacheKey = CACHE_KEY_PREFIX + reciterName;
  const cacheItem = {
    timestamp: Date.now(),
    data: data
  };
  localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
};

// API call with retry logic
export const fetchReciterDescription = async (reciterName) => {
  // Check cache first
  const cachedResult = getCachedData(reciterName);
  if (cachedResult) return cachedResult;

  // API request configuration
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
  const prompt = `Provide a detailed description of Quran reciter ${reciterName} including:
  - Full name and background
  - Style of recitation
  - Notable recordings
  - Historical significance
  - Any unique characteristics`;

  let retries = 0;
  const MAX_RETRIES = 3;
  const BASE_DELAY = 1000; // 1 second

  while (retries < MAX_RETRIES) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Cache successful response
      setCachedData(reciterName, text);
      return text;

    } catch (error) {
      if (error?.error?.status === 429) {
        // Calculate exponential backoff
        const delay = BASE_DELAY * Math.pow(2, retries);
        console.warn(`Rate limited. Retrying in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
      } else {
        // For other errors, clear cache and throw
        localStorage.removeItem(CACHE_KEY_PREFIX + reciterName);
        throw new Error(`API Error: ${error.message}`);
      }
    }
  }

  throw new Error("Too many requests. Please try again later.");
};

// Utility function to clear all cached reciter data
export const clearReciterCache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
};