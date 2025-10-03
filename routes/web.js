import {profileUpdateSchema} from '../app/validators/profileValidator.js';
import express from 'express';
import RecommendationController from '../app/controllers/RecommendationController.js';
import AuthController from '../app/controllers/AuthController.js';
import DashboardController from '../app/controllers/DashboardController.js';
import {isAuthenticated} from '../app/middlewares/authMiddleware.js';
import MealController from '../app/controllers/MealController.js';
import upload from '../config/multer.js';
import ProfileController from '../app/controllers/ProfileController.js';

const router = express.Router();

// auth routers
router.get('/login', AuthController.login);
router.post('/login', AuthController.loginPost);
router.post('/logout', AuthController.logout);

// meal routes
router.get('/meals/upload', isAuthenticated, MealController.uploadPage);
router.post(
   '/meals/analyze',
   isAuthenticated,
   upload.single('mealImage'),
   MealController.analyze
);
router.get('/meals/:id', isAuthenticated, MealController.show);

// user routers

router.get('/dashboard', isAuthenticated, DashboardController.dashboard);
router.get('/register', AuthController.register);
router.post('/register', AuthController.registerPost);
// profile routes
router.get('/profile', isAuthenticated, ProfileController.show);
router.patch(
   '/profile',
   isAuthenticated,
   profileUpdateSchema,
   ProfileController.update
);

router.get('/recommendations', RecommendationController.index);

router.get('/', function (req, res) {
   res.render('home');
});
router.get('/historique', MealController.historiqueShow);
router.delete('/historique/:id', MealController.deletehistorique);

router.get('/isAuth', function (req, res) {
   if (req.session.user) {
      res.json({auth: true});
   } else {
      res.json({auth: false});
   }
});

export default router;
