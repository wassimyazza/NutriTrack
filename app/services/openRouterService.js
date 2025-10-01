import OpenAI from 'openai';
import fs from 'fs';

class OpenRouterService {
   constructor() {
      if (!process.env.OPENROUTER_API_KEY) {
         throw new Error('OPENROUTER_API_KEY is not defined in .env file');
      }

      this.openai = new OpenAI({
         baseURL: 'https://openrouter.ai/api/v1',
         apiKey: process.env.OPENROUTER_API_KEY,
      });
   }

   async analyzeMealImage(imagePath) {
      try {
         const imageBuffer = fs.readFileSync(imagePath);
         const base64Image = imageBuffer.toString('base64');
         const mimeType = this.getMimeType(imagePath);

         const prompt = `Analyze this meal image and provide detailed nutritional information in French. 
            
            Please provide:
            1. List of foods identified in the image
            2. Estimated calories (kcal)
            3. Estimated proteins (g)
            4. Estimated carbohydrates (g)
            5. Estimated fats (g)
            6. Health recommendations based on the meal
            
            Format the response in JSON like this:
            {
                "foods": ["food1", "food2"],
                "calories": 500,
                "proteins": 25,
                "carbs": 60,
                "fats": 15,
                "recommendations": ["recommendation1", "recommendation2"]
            }`;

         const completion = await this.openai.chat.completions.create({
            model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
            messages: [
               {
                  role: 'user',
                  content: [
                     {
                        type: 'text',
                        text: prompt,
                     },
                     {
                        type: 'image_url',
                        image_url: {
                           url: `data:${mimeType};base64,${base64Image}`,
                        },
                     },
                  ],
               },
            ],
         });

         const text = completion.choices[0].message.content;
         console.log('OpenRouter response:', text);

         const jsonMatch = text.match(/\{[\s\S]*\}/);
         if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
         }

         return {
            foods: ['Aliments détectés'],
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            recommendations: [text],
         };
      } catch (error) {
         console.error('Error analyzing image with OpenRouter:', error);
         throw error;
      }
   }

   getMimeType(imagePath) {
      const ext = imagePath.split('.').pop().toLowerCase();
      const mimeTypes = {
         jpg: 'image/jpeg',
         jpeg: 'image/jpeg',
         png: 'image/png',
         gif: 'image/gif',
         webp: 'image/webp',
      };
      return mimeTypes[ext] || 'image/jpeg';
   }
}

export default new OpenRouterService();
