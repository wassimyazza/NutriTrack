import Meal from "../models/Meal.js";
import geminiService from '../services/geminiService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class MealController {
   static uploadPage(req, res) {
      res.render('meals/upload', {user: req.session.user});
   }

   static async analyze(req, res){
      try{
         if(!req.file){
            return res.status(400).send("No image uploaded");
         }

         const image_name = req.file.filename;
         const image_path = "/images/uploads/" + image_name;
         const fullImagePath = path.join(__dirname, '../../public/images/uploads/', req.file.filename);

         console.log('Analyzing image with Gemini AI...');
         const analysis = await geminiService.analyzeMealImage(fullImagePath);
         console.log('Analysis result:', analysis);

         const mealData = {
            user_id: req.session.user.id,
            image_path: image_name,
            name: req.body.mealName || 'Sans nom',
            analyzed: 1,
            calories: analysis.calories || 0,
            proteins: analysis.proteins || 0,
            carbs: analysis.carbs || 0,
            fats: analysis.fats || 0
         };

         await Meal.createWithRecommendations(mealData, analysis.recommendations);

         res.render('meals/result', { 
            user: req.session.user,
            imagePath: image_path,
            mealName: req.body.mealName || 'Sans nom',
            notes: req.body.notes || 'Aucune note',
            filename: image_name,
            analysis: analysis
         });

      }catch(err){
         console.error("Analyse function errors: ", err);
         res.status(500).send('An error occurred during analysis: ' + err.message);
      }
   }

   static async historiqueShow(req, res) {
      try {
         const meals = await Meal.findByUserId(req.session.user.id);
         res.render('meals/historique', { 
            user: req.session.user,
            meals: meals 
         });
      } catch (err) {
         console.error("Historique error: ", err);
         res.status(500).send('An error occurred');
      }
   }
}