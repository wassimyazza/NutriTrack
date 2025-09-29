import User from '../models/User.js';

export default class AuthController {
    static login(req, res) {
        res.render('auth/login');
    }

    static loginPost(req, res) {
        const { email, password } = req.body;

        User.findByEmail(email, (err, user) => {
            if (err) return res.send('Database error');
            if (!user) return res.send('Email or password incorrect');

            bcrypt.compare(password, user.password, (err, match) => {
                if (err) return res.send('Error checking password');
                if (!match) return res.send('Email or password incorrect');

                req.session.user = { id: user.id, name: user.name, email: user.email };
                res.redirect('/dashboard');
            });
        });
    }
}
