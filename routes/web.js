// routes/web.js
import express from 'express';
import BookController from '../app/controllers/BookController.js';
import RecommendationController from '../app/controllers/RecommendationController.js';
import AuthController from '../app/controllers/AuthController.js';
import ProfileController from '../app/controllers/ProfileController.js';
import DashboardController from '../app/controllers/DashboardController.js';
import {isAuthenticated} from '../app/middlewares/authMiddleware.js';

const router = express.Router();

// auth routers
router.get('/login', AuthController.login);
router.post('/login', AuthController.loginPost);
router.post('/logout', AuthController.logout);

// user routers

router.get('/dashboard', isAuthenticated, DashboardController.dashboard);
// profile routes
router.get('/profile', isAuthenticated, ProfileController.show);
router.patch('/profile', isAuthenticated, ProfileController.update);

router.get('/books', BookController.index);
router.get('/books/:id', BookController.show);
router.post('/books', BookController.store);
router.post('/books/:id/update', BookController.update);
router.post('/books/:id/delete', BookController.destroy);

router.get('/recommendations', RecommendationController.index);

export default router;
