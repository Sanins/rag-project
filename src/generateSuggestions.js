import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const generateSuggestions = async (input) => {
    return await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
  You are an assistant that reviews property listing text and suggests helpful additions to improve completeness and clarity.
  
  Focus on areas like:
  - Access instructions (e.g., where to get keys)
  - Parking information
  - Mention of amenities (e.g., WiFi, towels, hot tub)
  - Location details (postcode, city)
  
  Your output should be a short list of specific suggestions, in plain English, to help the user enhance the listing.
  If nothing is missing, say: "No suggestions needed — the description looks complete."
          `,
        },
        {
          role: 'user',
          content: input,
        },
      ],
    });
  };