import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function smartRAG(textFields, customRules, aiModel) {
  if (aiModel && aiModel.type === 'openai') {
    try {
      const results = [];

      for (const textField of textFields) {
        const response = await openai.chat.completions.create({
          model: aiModel.model,
          messages: [
            {
              role: 'system',
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
                        `
                      },
                      {
                        role: 'user',
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
              `
            }
          ],
          response_format: { type: 'json_object' }
        });
      
        const structuredData = JSON.parse(response.choices[0].message.content);
        results.push(structuredData);
      }

      return {
        results
      };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  } else {
    // possibly add gemini here?
  }
}