import database from '../../database/db.js';
import Meal from '../models/Meal.js';
import geminiService from '../services/geminiService.js';
import path from 'path';
import {fileURLToPath} from 'url';
import User from '../models/User.js';
import Meal_user from '../models/Meal_user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class MealController {
   static uploadPage(req, res) {
      res.render('meals/upload', {
         user: req.session.user,
         authUser: req.session.user,
      });
   }

   static async analyze(req, res) {
      try {
         if (!req.file) {
            return res.status(400).send('No image uploaded');
         }

         const image_name = req.file.filename;
         const image_path = '/images/uploads/' + image_name;
         const fullImagePath = path.join(
            __dirname,
            '../../public/images/uploads/',
            req.file.filename
         );

         const userId = req.session.user.id;
         const user = await User.findById(userId);

         console.log('Analyzing image with Gemini AI...');
         const analysis = await geminiService.analyzeMealImage(
            fullImagePath,
            user
         );
         console.log('Analysis result:', analysis);

         const mealData = {
            user_id: req.session.user.id,
            image_path: image_name,
            name: req.body.mealName || 'Sans nom',
            analyzed: 1,
            calories: analysis.calories || 0,
            proteins: analysis.proteins || 0,
            carbs: analysis.carbs || 0,
            fats: analysis.fats || 0,
         };

         await Meal.createWithRecommendations(
            mealData,
            analysis.recommendations
         );

         res.render('meals/result', {
            user: req.session.user,
            imagePath: image_path,
            mealName: req.body.mealName || 'Sans nom',
            notes: req.body.notes || 'Aucune note',
            filename: image_name,
            analysis: analysis,
            authUser: req.session.user,
         });
      } catch (err) {
         console.error('Analyse function errors: ', err);
         res.status(500).send(
            'An error occurred during analysis: ' + err.message
         );
      }
   }

   static async historiqueShow(req, res) {
      try {
         const user_id = req.session.user.id;
         console.log('User ID:', user_id);
         const meals = await Meal_user.findByUser(user_id);
         res.render('meals/historique', {
            meals: meals,
            authUser: req.session.user,
         });
      } catch (error) {
         console.error('Error in historiqueShow:', error);
         res.status(500).send('Erreur serveur');
      }
   }

   static async deletehistorique(req, res) {
      const user_meal_id = req.params.id;
      console.log('Deleting user_meal_id:', user_meal_id);
      try {
         const connection = database.getConnection();
         await connection.query('DELETE FROM user_meals WHERE id = ?', [
            user_meal_id,
         ]);
         return res.json('deleted');
      } catch (e) {
         console.error('Error deleting meal:', e);
         return res.json('error');
      }
   }

   static async show(req, res) {
      try {
         const mealId = req.params.id;
         const userId = req.session.user.id;

         const connection = database.getConnection();

         const [meals] = await connection.query(
            'SELECT * FROM meals WHERE id = ?',
            [mealId]
         );

         if (!meals || meals.length === 0) {
            return res.status(404).send('Repas introuvable');
         }

         const meal = meals[0];

         if (meal.user_id !== userId) {
            return res.status(403).send('Accès refusé');
         }

         const [recommendations] = await connection.query(
            'SELECT * FROM recommendations WHERE meal_id = ?',
            [mealId]
         );

         const success = req.query.success === 'true';

         res.render('meals/show', {
            user: req.session.user,
            meal: meal,
            recommendations: recommendations,
            success: success,
            authUser: req.session.user,
         });
      } catch (err) {
         console.error('Show meal error:', err);
         res.status(500).send('Une erreur est survenue');
      }
   }

   static async addToEaten(req, res) {
      try {
         const mealId = req.params.id;
         const userId = req.session.user.id;

         const meal = await Meal.find(mealId);

         if (!meal) {
            return res.status(404).send('Repas introuvable');
         }

         if (meal.user_id !== userId) {
            return res.status(403).send('Accès refusé');
         }

         const todayDate = new Date();
         const year = todayDate.getFullYear();
         const month = todayDate.getMonth() + 1;
         const day = todayDate.getDate();
         const today = year + '-' + month + '-' + day;

         const connection = database.getConnection();
         await connection.query(
            'INSERT INTO user_meals (user_id, meal_id, date) VALUES (?, ?, ?)',
            [userId, mealId, today]
         );

         res.redirect('/meals/' + mealId + '?success=true');
      } catch (err) {
         console.error('Add to eaten error:', err);
         res.status(500).send('Une erreur est survenue');
      }
   }
}
