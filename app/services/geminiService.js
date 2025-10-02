import {GoogleGenerativeAI} from '@google/generative-ai';
import fs from 'fs';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
   throw new Error('GEMINI_API_KEY is not defined in .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({model: 'gemini-2.5-flash'});

async function analyzeMealImage(imagePath) {
   try {
      const imageFile = fs.readFileSync(imagePath);
      const imageBase64 = imageFile.toString('base64');

      let imageType = 'image/jpeg';
      if (imagePath.endsWith('.png')) {
         imageType = 'image/png';
      } else if (imagePath.endsWith('.gif')) {
         imageType = 'image/gif';
      } else if (imagePath.endsWith('.webp')) {
         imageType = 'image/webp';
      }

      const promptText = `Analyze this meal image and provide detailed nutritional information in French. 
        
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

      const imageData = {
         inlineData: {
            data: imageBase64,
            mimeType: imageType,
         },
      };

      const result = await model.generateContent([promptText, imageData]);
      const response = result.response;
      const responseText = response.text();

      console.log('Gemini response:', responseText);

      const startIndex = responseText.indexOf('{');
      const endIndex = responseText.lastIndexOf('}');

      if (startIndex !== -1 && endIndex !== -1) {
         const jsonText = responseText.substring(startIndex, endIndex + 1);
         const analysisData = JSON.parse(jsonText);
         return analysisData;
      }

      return {
         foods: ['Aliments détectés'],
         calories: 0,
         proteins: 0,
         carbs: 0,
         fats: 0,
         recommendations: [],
      };
   } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
   }
}

export default {analyzeMealImage};
