import Book from '../models/Book.js';

export default class BookController {
   static async index(req, res) {
      try {
         const books = await Book.all();
         res.render('books/index', {books});
      } catch (err) {
         res.status(500).send(err.message);
      }
   }

   static async show(req, res) {
      try {
         const book = await Book.find(req.params.id);
         if (!book) return res.status(404).send('Livre non trouvé');
         res.render('books/show', {book});
      } catch (err) {
         res.status(500).send(err.message);
      }
   }

   static async store(req, res) {
      try {
         const {title, author} = req.body;
         const book = await Book.create({title, author});
         res.redirect('/books');
      } catch (err) {
         res.status(500).send(err.message);
      }
   }

   static async update(req, res) {
      try {
         const {title, author} = req.body;
         await Book.update(req.params.id, {title, author});
         res.redirect('/books');
      } catch (err) {
         res.status(500).send(err.message);
      }
   }

   static async destroy(req, res) {
      try {
         await Book.delete(req.params.id);
         res.redirect('/books');
      } catch (err) {
         res.status(500).send(err.message);
      }
   }
}
