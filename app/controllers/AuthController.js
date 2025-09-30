import User from '../models/User.js';
import bcrypt from 'bcrypt';

export default class AuthController {
   static login(req, res) {
      res.render('auth/login');
   }

   static async loginPost(req, res) {
      try {
         const {email, password} = req.body;
         const user = await User.findByEmail(email);
         if (!user) {
            return res.status(401).send('Email or password incorrect');
         }
         const match = await bcrypt.compare(password, user.password);
         if (!match) {
            return res.status(401).send('Email or password incorrect');
         }
         req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
         };
         res.redirect('/dashboard');
      } catch (err) {
         console.error('Login error:', err);
         res.status(500).send('An error occurred during login');
      }
   }

   static logout(req, res) {
      req.session.destroy(err => {
         if (err) {
            return res.status(500).send('Could not log out');
         }
         res.redirect('/login');
      });
   }
}
