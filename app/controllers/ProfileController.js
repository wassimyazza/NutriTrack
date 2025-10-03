import User from '../models/User.js';
import bcrypt from 'bcrypt';
import {validationResult} from 'express-validator';

export default class ProfileController {
   static async show(req, res) {
      const user_id = req.session.user.id;
      const user = await User.find(user_id);
      res.render('profile/index', {
         user,
         errors: {},
         authUser: req.session.user,
      });
   }

   static async update(req, res) {
      const user_id = req.session.user.id;
      if (req.body.password.trim())
         req.body.password = await bcrypt.hash(req.body.password, 12);

      const errors = validationResult(req).array();
      const mappedErrors = {};
      if (errors.length) {
         errors.forEach(err => {
            mappedErrors[err.path] = err.msg;
         });
      } else {
         User.update(user_id, req.body);
      }

      const newUser = await User.find(user_id);

      res.render('profile/index', {user: newUser, errors: mappedErrors});
   }
}
