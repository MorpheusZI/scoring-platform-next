// node --version # Should be >= 18
// npm install @google/generative-ai

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = process.env.GENAI_API_KEY || "";

const NewAI = new GoogleGenerativeAI(API_KEY);
const model = NewAI.getGenerativeModel({ model: MODEL_NAME })

export { NewAI, model }
