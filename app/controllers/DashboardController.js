import User from '../models/User.js';
import Meal from '../models/Meal.js';
import Recommendation from '../models/Recommendation.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import 'dayjs/locale/fr.js';

dayjs.extend(relativeTime);
dayjs.locale('fr');
export default class DashboardController {
   static async show(req, res) {
      const userId = req.session.user.id;
      const user = await User.find(userId);
      const allMeals = await Meal.all();
      const meals = allMeals
         .filter(meal => meal.user_id == userId)
         .sort((a, b) => b - a);

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

      const recommendations = await Recommendation.getLastThreeByUserId(userId);
      recommendations.forEach(
         recommendation =>
            (recommendation.timePassed = dayjs(
               recommendation.created_at
            ).fromNow())
      );

      res.render('dashboard/index.ejs', {
         user,
         meals,
         recommendations,
         authUser: req.session.user,
      });
   }
}
