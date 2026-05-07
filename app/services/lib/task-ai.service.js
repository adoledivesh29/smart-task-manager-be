const { GoogleGenerativeAI } = require('@google/generative-ai');
const { FALLBACK_CATEGORY_NAME } = require('../../utils').categoryMetadata;

function extractJSONObject(rawText = '') {
  const trimmedText = String(rawText || '').trim();
  if (!trimmedText) return '';

  const fencedMatch = trimmedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) return fencedMatch[1].trim();

  const firstBrace = trimmedText.indexOf('{');
  const lastBrace = trimmedText.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) return '';

  return trimmedText.slice(firstBrace, lastBrace + 1);
}

function sanitizeDifficultyScore(value) {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue)) return null;

  const roundedValue = Math.round(parsedValue);
  if (roundedValue < 1 || roundedValue > 10) return null;
  return roundedValue;
}

function sanitizeCategory(value) {
  if (typeof value !== 'string') return FALLBACK_CATEGORY_NAME;
  const sanitizedValue = value.trim().replace(/\s+/g, ' ');
  return sanitizedValue || FALLBACK_CATEGORY_NAME;
}

async function analyzeTaskDescription(sDescription) {
  const fallbackResult = {
    nDifficultyScore: null,
    sCategory: FALLBACK_CATEGORY_NAME,
  };

  try {
    if (!process.env.GEMINI_API_KEY) return fallbackResult;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const prompt = `Analyze the following task description and return a JSON object with a difficultyScore from 1 to 10 and a single category name.
Task Description: "${sDescription}"
Respond with JSON only in this format: {"difficultyScore": number, "category": string}`;

    const result = await model.generateContent(prompt);
    const responseText = result?.response?.text?.() || '';
    const jsonText = extractJSONObject(responseText);
    if (!jsonText) return fallbackResult;

    const parsedResponse = JSON.parse(jsonText);
    return {
      nDifficultyScore: sanitizeDifficultyScore(parsedResponse?.difficultyScore),
      sCategory: sanitizeCategory(parsedResponse?.category),
    };
  } catch (error) {
    console.error('task-ai.service analyzeTaskDescription error:', error);
    return fallbackResult;
  }
}

module.exports = {
  analyzeTaskDescription,
};
