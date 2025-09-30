import User from '../models/User.js';
import bcrypt from 'bcrypt';

export default class AuthController {
   static login(req, res) {
      res.render('auth/login');
   }

   static async loginPost(req, res) {
      try {
         const {email, password} = req.body;

         // Trouver l'utilisateur par email
         const user = await User.findByEmail(email);
         if (!user) return res.send('Email or password incorrect');

         // Vérifier le mot de passe
         const match = await bcrypt.compare(password, user.password);
         if (!match) return res.send('Email or password incorrect');

         // Créer la session
         req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
         };

         res.redirect('/dashboard');
      } catch (err) {
         console.error('Erreur login:', err);
         return res.send('Database error');
      }
   }

   static register(req, res) {
      res.render('auth/register');
   }

   static async registerPost(req, res) {
      console.log('=== REQUÊTE REÇUE ===');
      console.log('Content-Type:', req.headers['content-type']);
      console.log('Body:', req.body);
      console.log('Body keys:', Object.keys(req.body));

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

         const errors = [];

         if (!fullname || fullname.trim().length < 2) {
            errors.push('Le nom complet doit contenir au moins 2 caractères');
         }
         if (!email) {
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

         if (!terms || terms === 'false') {
            errors.push("Vous devez accepter les conditions d'utilisation");
         }

         if (errors.length > 0) {
            console.log('Erreurs de validation:', errors);
            return res.status(400).json({success: false, errors});
         }

         // Vérifier si l'email existe déjà (AVEC AWAIT!)
         const existingUser = await User.findByEmail(email);
         console.log('Utilisateur existant?', existingUser ? 'Oui' : 'Non');

         if (existingUser) {
            return res.status(400).json({
               success: false,
               errors: ['Cet email est déjà utilisé'],
            });
         }

         // Hasher le mot de passe
         const hashedPassword = await bcrypt.hash(password, 12);
         console.log('Mot de passe hashé');

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

         console.log("Création de l'utilisateur...");
         // Créer l'utilisateur (AVEC AWAIT!)
         const newUser = await User.create(finalUserData);
         console.log('Utilisateur créé avec ID:', newUser.id);

         // Créer la session
         req.session.user = {
            id: newUser.id,
            name: finalUserData.name,
            email: finalUserData.email,
         };

         console.log('✅ Inscription réussie!');
         return res.json({
            success: true,
            message: 'Compte créé avec succès !',
            redirect: '/dashboard',
         });
      } catch (error) {
         console.error('❌ Erreur registerPost:', error);
         return res
            .status(500)
            .json({success: false, message: 'Erreur interne du serveur'});
      }
   }
}
