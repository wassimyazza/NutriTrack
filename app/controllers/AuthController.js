import User from '../models/User.js';
import bcrypt from 'bcrypt';

export default class AuthController {
   static login(req, res) {
      res.render('auth/login');
   }

   static loginPost(req, res) {
      const {email, password} = req.body;

      User.findByEmail(email, (err, user) => {
         if (err) return res.send('Database error');
         if (!user) return res.send('Email or password incorrect');

         bcrypt.compare(password, user.password, (err, match) => {
            if (err) return res.send('Error checking password');
            if (!match) return res.send('Email or password incorrect');

            req.session.user = {
               id: user.id,
               name: user.name,
               email: user.email,
            };
            res.redirect('/dashboard');
         });
      });
   }

   static register(req, res) {
      res.render('auth/register');
   }

   static async registerPost(req, res) {
      console.log('Content-Type:', req.headers['content-type']);
      console.log('Body:', req.body);

      try {
         const {
            fullname,
            email,
            gender,
            age,
            weight,
            height,
            goal,
            condition_user,
            activity_level,
            password,
            terms,
         } = req.body;

         // Initialisation du tableau d'erreurs
         const errors = [];

         // --- VALIDATIONS ---
         if (!fullname || fullname.trim().length < 2) {
            errors.push('Le nom complet doit contenir au moins 2 caractères');
         }
         if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Veuillez entrer un email valide');
         }
         if (!age || age < 16 || age > 120) {
            errors.push("L'âge doit être entre 16 et 120 ans");
         }
         if (!weight || weight < 30 || weight > 300) {
            errors.push('Le poids doit être entre 30 et 300 kg');
         }
         if (!height || height < 100 || height > 250) {
            errors.push('La taille doit être entre 100 et 250 cm');
         }
         if (!gender) {
            errors.push('Veuillez sélectionner votre genre');
         }
         if (!goal) {
            errors.push('Veuillez sélectionner un objectif');
         }
         if (!condition_user) {
            errors.push('Veuillez sélectionner votre condition de santé');
         }
         if (!activity_level) {
            errors.push("Veuillez sélectionner votre niveau d'activité");
         }
         if (!password || password.length < 8) {
            errors.push('Le mot de passe doit contenir au moins 8 caractères');
         }

         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
         if (password && !passwordRegex.test(password)) {
            errors.push(
               'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
            );
         }

         if (!terms) {
            errors.push("Vous devez accepter les conditions d'utilisation");
         }

         if (errors.length > 0) {
            return res.status(400).json({success: false, errors});
         }

         // Vérifier si l'email est déjà utilisé
         User.findByEmail(email, async (err, existingUser) => {
            if (err) {
               console.error('Erreur vérification email:', err);
               return res
                  .status(500)
                  .json({success: false, message: 'Erreur de base de données'});
            }

            if (existingUser) {
               return res.status(400).json({
                  success: false,
                  errors: ['Cet email est déjà utilisé'],
               });
            }

            // Hachage du mot de passe
            const hashedPassword = await bcrypt.hash(password, 12);

            // Préparation des données pour la DB
            const finalUserData = {
               name: fullname.trim(),
               email: email.toLowerCase().trim(),
               password: hashedPassword,
               age: parseInt(age),
               gender,
               height: parseFloat(height),
               weight: parseFloat(weight),
               activity_level,
               goal,
               condition_user,
            };

            // Création de l'utilisateur
            User.create(finalUserData, (err, result) => {
               if (err) {
                  console.error('Erreur création utilisateur:', err);
                  return res.status(500).json({
                     success: false,
                     message: 'Erreur lors de la création du compte',
                  });
               }

               // Sauvegarde dans la session
               req.session.user = {
                  id: result.insertId,
                  name: finalUserData.name,
                  email: finalUserData.email,
               };

               return res.json({
                  success: true,
                  message: 'Compte créé avec succès !',
                  redirect: '/dashboard',
               });
            });
         });
      } catch (error) {
         console.error('Erreur registerPost:', error);
         return res
            .status(500)
            .json({success: false, message: 'Erreur interne du serveur'});
      }
   }
}
