
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Question } from './types';

// Initialize the GoogleGenAI client, assuming API_KEY is in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for the expected JSON response from the model.
const questionSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: {
          type: Type.STRING,
          description: 'The full text of the question, including any mathematical notations.',
        },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: 'The possible answers for the question.',
        },
      },
      required: ["question", "options"],
    },
  };

export const parseQuestionsFromImage = async (base64Image: string): Promise<Question[]> => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
        },
    };

    const textPart = {
        text: `
        You are an expert Optical Character Recognition (OCR) system specialized in math question papers.
        Your task is to meticulously extract all multiple-choice math questions from the provided image.
        For each question, you must identify the question text and all its corresponding options. Pay close attention to mathematical notations, symbols, and equations.
        Your response must be a valid JSON array of objects conforming to the provided schema. Do not include any introductory text or markdown formatting.`
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: questionSchema,
            },
        });

        const responseText = response.text.trim();
        if (!responseText) {
            throw new Error("AI returned an empty response. The image might be unclear or contain no questions.");
        }
        
        const parsedQuestions = JSON.parse(responseText);
        
        // Basic validation to ensure we have an array of questions
        if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0 || parsedQuestions.some(q => !q.question || !Array.isArray(q.options))) {
             throw new Error("AI failed to parse questions correctly. Please try a different image or ensure questions are in a multiple-choice format.");
        }

        return parsedQuestions as Question[];

    } catch (err) {
        console.error("Error calling Gemini API or parsing response:", err);
        // Provide a more user-friendly error message
        if (err instanceof Error && err.message.includes('json')) {
            throw new Error("The AI returned an invalid format. Please try again with a clearer image.");
        }
        throw new Error("Failed to parse questions from the image. Please ensure the image is clear and contains standard multiple-choice questions.");
    }
};
