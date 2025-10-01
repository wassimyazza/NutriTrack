import User from '../models/User.js';
import bcrypt from 'bcrypt';

export default class ProfileController {
   static async show(req, res) {
      const user_id = req.session.user.id;
      const user = await User.find(user_id);
      res.render('profile/index', {user});
   }

   static async update(req, res) {
      const user_id = req.session.user.id;

      if (req.body.password.trim())
         req.body.password = await bcrypt.hash(req.body.password, 12);

      const newUser = await User.update(user_id, req.body);
      console.log(newUser);

      res.render('profile/index', {user: newUser});
   }
}
