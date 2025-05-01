import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

  
export const generateMockFreeText = async () => {
    return await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
            You are a content generator for testing AI extraction tools.
            Generate natural-sounding, realistic free-text descriptions that might appear on a booking platform.
            These should include:
            - Access instructions
            - Parking info
            - Mention of amenities (like WiFi, hot tub, towels)
            - City and postcode (UK)
            
            Keep the tone informal, like something a homeowner might write.
          `,
        },
        {
          role: 'user',
          content: `Generate a realistic free-text description.`,
        },
      ],
    });
  };