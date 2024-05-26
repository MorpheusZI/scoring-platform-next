// node --version # Should be >= 18
// npm install @google/generative-ai

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = process.env.GENAI_API_KEY || "";

const genConfig = {
  temperature: 1,
};

const safety = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const NewAI = new GoogleGenerativeAI(API_KEY);
const model = NewAI.getGenerativeModel({ model: MODEL_NAME, generationConfig: genConfig, safetySettings: safety })

export { NewAI, model }
