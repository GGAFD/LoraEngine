
import { GoogleGenAI, Modality, HarmCategory, HarmBlockThreshold } from "@google/genai";
import type { GeneratedImage } from '../types';

// Helper to get a random item from an array
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- PROMPT FRAGMENTS FOR LORA TRAINING VARIATIONS ---

const poses = ["profile view", "3/4 view", "looking over the shoulder", "head tilted curiously", "hand gently touching cheek", "straight-on", "slightly high angle", "three-quarter body turn", "leaning against a wall"];
const expressions = ["a sweet, gentle smile", "a shy, cute glance", "a playful, innocent look", "a soft, dreamy expression", "a happy, natural laugh", "a quiet, serene gaze", "a thoughtful frown", "a look of surprise (mouth slightly open)", "a content sigh", "a wistful look into the distance", "concentrating intently"];
const lightings = ["soft studio lighting", "gentle side lighting", "golden hour sunlight", "soft cinematic lighting", "dramatic Rembrandt lighting", "soft window light", "neon city lights at night"];
const framings = ["an extreme close-up on the eyes", "a close-up portrait", "a medium shot", "an upper body shot", "a detailed facial portrait", "a full-body shot"];
const backgrounds = ["in a modern, sunlit kitchen", "sitting in a cozy cafe by a window", "in a library with bookshelves blurred behind", "on a city street at dusk with bokeh lights", "a minimalist bright studio with soft shadows", "a dreamy, softly focused garden", "against a clean, pastel-colored wall", "in a minimalist art gallery"];
const styles = [
    "wearing a simple white t-shirt",
    "in a cozy oversized knit sweater",
    "wearing a chic bikini top under an open linen shirt",
    "in an elegant backless evening dress",
    "artfully draped in luxurious silk fabric",
    "wearing a stylish off-the-shoulder top",
    "in a tasteful one-piece swimsuit in a sunlit setting",
    "wearing a cropped sweater, revealing a sliver of midriff",
    "wearing a denim jacket",
    "in a sporty hoodie",
    "dressed in a simple black turtleneck",
];

// Safety settings to allow for artistic freedom while maintaining general safety
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

const generateUniqueVariation = (): string => {
  const framing = getRandomItem(framings);
  const expression = getRandomItem(expressions);
  const lighting = getRandomItem(lightings);
  const pose = getRandomItem(poses);
  const style = getRandomItem(styles);
  const background = getRandomItem(backgrounds);

  // This prompt now ONLY focuses on the scene, as the identity is handled by the "Identity Lock"
  const prompt = `
**Scene Details:**
- **Framing:** ${framing}
- **Pose:** ${pose}
- **Lighting:** ${lighting}
- **Expression:** ${expression}
- **Style:** ${style}
- **Background:** ${background}
`.trim().replace(/\s+/g, ' ');

  return prompt;
};

// Generic image generation function
const generateImage = async (
    imageData: { data: string; mimeType: string }[],
    prompt: string
): Promise<GeneratedImage> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const imageParts = imageData.map(img => ({
        inlineData: {
            mimeType: img.mimeType,
            data: img.data,
        },
    }));

    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [...imageParts, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
                safetySettings: safetySettings,
            },
        });

        if (response.promptFeedback?.blockReason) {
            throw new Error(`Generation blocked: ${response.promptFeedback.blockReason}.`);
        }
        if (response.candidates?.[0]?.finishReason === 'SAFETY') {
            const safetyRatings = response.candidates[0].safetyRatings?.map(r => `${r.category.replace('HARM_CATEGORY_', '')}: ${r.probability}`).join(', ');
            throw new Error(`Generation stopped for safety reasons. [${safetyRatings || 'N/A'}].`);
        }
        
        const generatedImageBytes = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

        if (!generatedImageBytes) {
            throw new Error("API did not return an image. This might be due to safety filters or a restrictive prompt.");
        }

        const imageUrl = `data:image/jpeg;base64,${generatedImageBytes}`;
        return {
            id: crypto.randomUUID(),
            url: imageUrl,
            prompt: prompt,
        };
    } catch (error) {
        console.error(`Error during image generation`, error);
        if (error instanceof Error) {
            if (error.message.includes('429')) {
                 throw new Error("Rate limit exceeded. Please wait a moment before trying again.");
            }
            throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred during image generation.");
    }
}

export const generateBaseImage = async (
  imageData: { data: string; mimeType: string }[],
  age: number
): Promise<GeneratedImage> => {
    const basePrompt = `
    **PRIMARY OBJECTIVE: CREATE A PERFECT, NEUTRAL BASE PORTRAIT.**
    Your most important task is to create a new, ultra-photorealistic portrait of the exact same person shown in the reference photos. This image will serve as the definitive "base identity" for all future variations. The subject is a woman approximately ${age} years old.
    - Maintain **absolute consistency** with her facial features, structure, skin tone, and hair. Do not alter her identity.
    - **Composition:** A clean, centered, straight-on, shoulders-up studio portrait.
    - **Expression:** A calm, neutral, and relaxed expression.
    - **Lighting:** Flattering, soft studio lighting.
    - **Background:** A simple, neutral grey or off-white studio background.
    - **Image Style:** Ultra-realistic, 8k, professional photography, cinematic quality, sharp focus.
  `.trim().replace(/\s+/g, ' ');

  return generateImage(imageData, basePrompt);
};

export const generateVariationImage = async (
  imageData: { data: string; mimeType: string }[],
  age: number
): Promise<GeneratedImage> => {
    const scenePrompt = generateUniqueVariation();

    const variationPrompt = `
    **PRIMARY OBJECTIVE: REPLICATE THE PERSON IN THE REFERENCE IMAGES.**
    Your most important task is to create a new, photorealistic image of the exact same person shown in the reference photos (especially the primary base identity image). The subject is a woman approximately ${age} years old.
    Maintain **absolute consistency** with her facial features, structure, skin tone, and hair from the provided images. Do not alter her identity in any way.

    ---

    ${scenePrompt}

    ---
    
    **Image Style Requirements:**
    - Ultra-realistic, 8k, professional photography quality.
    - Photorealistic skin texture with sharp focus.
    - Cinematic color grading.
  `.trim().replace(/\s+/g, ' ');
  
  return generateImage(imageData, variationPrompt);
};


export const editImage = async (
  imageData: { data: string; mimeType: string }[],
  prompt: string
): Promise<GeneratedImage> => {
  return generateImage(imageData, prompt);
};
