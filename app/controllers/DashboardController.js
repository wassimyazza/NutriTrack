import User from '../models/User.js';
import Meal from '../models/Meal.js';
export default class DashboardController {
   static async show(req, res) {
      const userId = req.session.user.id;
      const user = await User.find(userId);
      const allMeals = await Meal.all();
      const meals = allMeals
         .filter(meal => meal.user_id == 2)
         .sort((a, b) => b - a)
         .slice(0, 3);

      meals.forEach(
         meal =>
            (meal.created_at = new Date(meal.created_at).toLocaleDateString(
               'fr-FR',
               {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
               }
            ))
      );

      res.render('dashboard/index.ejs', {
         user,
         meals,
      });
   }
}
