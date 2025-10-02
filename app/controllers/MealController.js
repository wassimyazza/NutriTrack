import database from '../../database/db.js';
import mysql from 'mysql2/promise';
import Meal from '../models/Meal.js';
import geminiService from '../services/geminiService.js';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class MealController {
   static uploadPage(req, res) {
      res.render('meals/upload', {user: req.session.user});
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
         });
      } catch (err) {
         console.error('Analyse function errors: ', err);
         res.status(500).send(
            'An error occurred during analysis: ' + err.message
         );
      }
   }

   static async historiqueShow(req, res) {
      const user_id = req.session.user.id;
      console.log('hello ', user_id);
      const connection = database.getConnection();
      const [rows] = await connection.query(
         `
         Select * from meals where user_id = ? 
         `,
         [user_id]
      );

      res.render('meals/historique', {meals: rows});
   }

   static async deletehistorique(req, res) {
      const id_meal = req.params.id;
      console.log(id_meal);
      try {
         Meal.delete(id_meal);
         return res.json('deleted');
      } catch (e) {
         return res.json('error');
      }
   }

   static show(req, res) {
      res.render('meals/show', {user: req.session.user});
   }
}
