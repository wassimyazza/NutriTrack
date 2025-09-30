// routes/web.js
import express from 'express';
import BookController from '../app/controllers/BookController.js';
import RecommendationController from '../app/controllers/RecommendationController.js';
import AuthController from '../app/controllers/AuthController.js';

const router = express.Router();

// auth routers
router.get('/login', AuthController.login);
router.post('/login', AuthController.loginPost);

router.get('/books', BookController.index);
router.get('/books/:id', BookController.show);
router.post('/books', BookController.store);
router.post('/books/:id/update', BookController.update);
router.post('/books/:id/delete', BookController.destroy);

router.get('/recommendations', RecommendationController.index);

export default router;
