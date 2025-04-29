import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function smartRAG(textFields, customRules) {
  try {
    const results = [];

    for (const textField of textFields) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `
              You are an AI that extracts structured information from a free text field.
              You must also apply custom data validation rules provided below.
              Respond ONLY in JSON format with fields: access_instructions, parking_info, amenities, postcode, city.

              Custom rules:
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
                "access_instructions": string,
                "parking_info": string,
                "amenities": string[],
                "postcode": string,
                "city": string
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
}