import { OpenAI } from "openai";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function smartRAG(textFields, customRules, aiModel) {
  if (aiModel && aiModel.type === "openai") {
    try {
      const results = [];

      for (const textField of textFields) {
        const response = await openai.chat.completions.create({
          model: aiModel.model,
          messages: [
            {
              role: "system",
              content: `
                You are an AI that extracts structured information from a free text field and provides diagnostic feedback.
                
                Respond ONLY in JSON format with the following fields:
                - access_instructions: string
                - parking_info: string
                - amenities: string[]
                - postcode: string
                - city: string
                - confidence_score: number (0–10) — your self-assessed confidence in the accuracy of the extracted values.
                - confidence_tip: string — if confidence_score < 10, explain briefly what is uncertain or missing and how the text could be improved to boost accuracy (e.g., "city appears to be a region", "postcode missing", "parking unclear").
                
                Custom data validation rules:
                ${customRules}
                        `,
            },
            {
              role: "user",
              content: `
                Free text to extract from:
                ${textField}
                
                Output format:
                {
                  "access_instructions": "...",
                  "parking_info": "...",
                  "amenities": ["..."],
                  "postcode": "...",
                  "city": "...",
                  "confidence_score": 0–10,
                  "confidence_tip": "..." // leave empty if confidence_score is 10
                }
              `,
            },
          ],
          response_format: { type: "json_object" },
        });

        const structuredData = JSON.parse(response.choices[0].message.content);
        results.push(structuredData);
      }

      return {
        results,
      };
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  } else {
    try {
      const results = [];

      for (const textField of textFields) {
        const response = await gemini.models.generateContent({
          model: aiModel.model,
          contents: `
            You are an AI that extracts structured information from a free text field and provides diagnostic feedback.
            Custom data validation rules: ${customRules}
            Free text to extract from: ${textField}
            `,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                access_instructions: {
                  type: Type.STRING,
                  description: "Instructions for accessing the location.",
                },
                parking_info: {
                  type: Type.STRING,
                  description: "Details about parking availability and rules.",
                },
                amenities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING,
                  },
                  description: "List of available amenities.",
                },
                postcode: {
                  type: Type.STRING,
                  description: "The postal code for the location.",
                },
                city: {
                  type: Type.STRING,
                  description: "The city where the location is.",
                },
                confidence_score: {
                  type: Type.NUMBER,
                  description: "A self-assessed confidence score from 0 to 10 regarding the accuracy of the extracted information.",
                  minimum: 0,
                  maximum: 10,
                },
                confidence_tip: {
                  type: Type.STRING,
                  description:
                    "A brief explanation of uncertainty or missing info if confidence_score < 10 (e.g., 'parking unclear', 'postcode missing').",
                },
              },
              required: ["access_instructions", "parking_info", "amenities", "postcode", "city", "confidence_score", "confidence_tip"],
            },
          },
        });

        const structuredData = JSON.parse(response.text);
        results.push(structuredData);

        console.log("Gemini response:", structuredData);
      }

      return {
        results,
      };
    } catch (error) {
      console.error("Error generating content from gemini", error);
      throw error;
    }
  }
}
