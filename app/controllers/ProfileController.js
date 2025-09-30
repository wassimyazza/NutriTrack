import User from '../models/User.js';

export default class ProfileController {
   static async show(req, res) {
      const user_id = req.session.user.id;
      const user = await User.find(user_id);
      res.render('profile/index', {user});
   }

   static update(res, req) {}
}
