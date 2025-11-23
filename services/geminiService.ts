import { GoogleGenAI, Type } from "@google/genai";

// Get API key from environment or use empty string (will use fallback)
const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '') as string;
// Only initialize AI client if we have an API key
let ai: GoogleGenAI | null = null;
try {
  if (apiKey && apiKey.trim() !== '') {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.warn('Could not initialize Gemini AI client:', e);
  ai = null;
}

export const analyzeDeliveryRequest = async (description: string, distanceKm: number) => {
  if (!apiKey || !ai) {
    // Fallback mock response if no key
    return {
      recommendedCategory: 'bike',
      estimatedPrice: 45,
      reasoning: "Based on your description (Simulated AI), a Bike is best."
    };
  }

  try {
    const prompt = `
      You are the AI engine for Pushr, a delivery app.
      Analyze this request: "${description}".
      Distance: ${distanceKm}km.
      
      Available categories:
      - Runner (Small items, < 2kg)
      - Wheelbarrow (Heavy items, < 1km, construction materials)
      - Bike (Medium items, food, envelopes)
      - Mover (Furniture, large boxes)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedCategory: {
              type: Type.STRING,
              description: "One of: walking, wheelbarrow, bike, truck"
            },
            estimatedPrice: {
              type: Type.NUMBER,
              description: "Estimated price in local currency"
            },
            reasoning: {
              type: Type.STRING,
              description: "Short reasoning"
            }
          },
          required: ["recommendedCategory", "estimatedPrice", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Error:", error);
    return {
      recommendedCategory: 'bike',
      estimatedPrice: 50,
      reasoning: "AI unavailable, defaulting to standard bike rate."
    };
  }
};

export const getPusherOptimizationTip = async (pusherStats: any) => {
   if (!apiKey || !ai) return "Try working on weekends for 20% more tips!";

   const prompt = `
     Given these stats for a delivery rider: ${JSON.stringify(pusherStats)}.
     Give 1 short, punchy sentence of advice to increase their earnings.
   `;

   try {
     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: prompt,
     });
     return response.text;
   } catch (e) {
     return "High demand in downtown area right now!";
   }
};