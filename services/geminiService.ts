import { GoogleGenAI, Type, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const getSceneIdeasFromText = async (description: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the description "${description}", generate 5 creative, detailed, and visually rich scene descriptions for a product photoshoot.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A creative scene description."
          },
        },
      },
    });
    const jsonStr = response.text.trim();
    const json = JSON.parse(jsonStr);
    return Array.isArray(json) ? json : [];
  } catch (error) {
    console.error("Error getting scene ideas from text:", error);
    throw new Error("Could not generate scene ideas from your description. The AI might be busy. Please try again in a moment.");
  }
};

export const getSceneIdeaFromImage = async (imageBase64: string, mimeType: string): Promise<string[]> => {
  try {
    const imagePart = fileToGenerativePart(imageBase64, mimeType);
    const textPart = { text: "Based on the style, mood, and environment of this image, generate 5 creative, detailed, and visually rich scene descriptions for a product photoshoot." };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A creative scene description inspired by the image."
          },
        },
      },
    });
    const jsonStr = response.text.trim();
    const json = JSON.parse(jsonStr);
    return Array.isArray(json) ? json : [];
  } catch (error) {
    console.error("Error getting scene ideas from image:", error);
    throw new Error("Could not generate scene ideas from the image. Please try a different image or try again.");
  }
};


export const generateImage = async (
  productImageBase64: string,
  productImageMimeType: string,
  prompt: string,
  settings: { lighting: string; cameraPerspective: string; aspectRatio: string }
): Promise<string> => {
    
    const fullPrompt = `You are a professional product photographer's assistant. Your task is to replace the background of the given image. The image has been padded to the final desired aspect ratio of ${settings.aspectRatio}. You must fill the entire canvas with a new, photorealistic background based on this description: "${prompt}". The lighting on the new background should be ${settings.lighting}, and the camera perspective should be ${settings.cameraPerspective}. The original product must be perfectly preserved, untouched, and seamlessly integrated into the new background. Do not alter the product itself in any way. The final image MUST have an aspect ratio of ${settings.aspectRatio}.`;

    const imagePart = fileToGenerativePart(productImageBase64, productImageMimeType);
    const textPart = { text: fullPrompt };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("The AI was unable to generate an image based on your prompt. This can sometimes happen with complex requests. Please try modifying your prompt.");
};

export const editImage = async (
  productImageBase64: string,
  productImageMimeType: string,
  prompt: string
): Promise<string> => {

  const fullPrompt = `Apply the following edit to the image based on the user's request: "${prompt}". The edit should be seamless and maintain the original image's photorealism and style.`;

  const imagePart = fileToGenerativePart(productImageBase64, productImageMimeType);
  const textPart = { text: fullPrompt };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  throw new Error("The AI was unable to apply the edit. Please try a different edit instruction.");
};