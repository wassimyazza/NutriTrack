// routes/web.js
import express from 'express';
import BookController from '../app/controllers/BookController.js';

const router = express.Router();

router.get('/books', BookController.index);
router.get('/books/:id', BookController.show);
router.post('/books', BookController.store);
router.post('/books/:id/update', BookController.update);
router.post('/books/:id/delete', BookController.destroy);

export default router;
