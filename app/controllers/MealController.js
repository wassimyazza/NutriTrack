import database from '../../database/db';
import Meal from '../models/Meal.js';

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

         const FinalData = {
            user_id: req.session.user.id,
            image_path: image_name,
         };

         Meal.create(FinalData);

         res.send('<img src="' + image_path + '">');
      } catch (err) {
         console.error('Analyse function errors: ', err);
         res.status(500).send('An error occurred during analysis');
      }
   }

   static async historiqueShow(req, res) {
      const id = req.session.user;
      const connection = database.getConnection();
      const historiqueUser = await connection.query(
         `
      Select * from meals where user_id = ? ;
      `,
         [id]
      );

      res.render('meals/historique', historiqueUser);
   }
}
