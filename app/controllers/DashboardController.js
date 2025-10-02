import User from '../models/User.js';
export default class DashboardController {
   static async show(req, res) {
      const userId = req.session.user.id;
      const user = await User.find(userId);
      res.render('dashboard/index.ejs', {
         user,
      });
   }
}
