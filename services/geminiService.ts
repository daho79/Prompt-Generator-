import { GoogleGenAI } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. The application might not work as expected.");
}

export const generatePromptFromImage = async (imageFile: File): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const base64Data = await fileToBase64(imageFile);

    const imagePart = {
      inlineData: {
        mimeType: imageFile.type,
        data: base64Data,
      },
    };

    const textPart = {
      text: "Generate a high-detail, artistic, and evocative prompt for an image generation AI. Describe the image in intricate detail. Focus on the subject, the environment, the lighting (e.g., cinematic lighting, Rembrandt lighting, soft light), the camera angle (e.g., low-angle shot, wide-angle), the artistic style (e.g., photorealistic, concept art, oil painting, watercolor), and the mood. Create a prompt that would allow an AI to recreate this image with precision and artistic flair."
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error in Gemini API call:", error);
    if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the API.");
  }
};
