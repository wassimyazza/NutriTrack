import database from '../../database/db.js';
import Model from './Model.js';

class User extends Model {
   static table = 'users';

   static async findByEmail(email) {
      try {
         const connection = database.getConnection();
         const [rows] = await connection.query(
            'SELECT * FROM users WHERE email = ? LIMIT 1',
            [email]
         );
         return rows[0] || null;
      } catch (err) {
         console.error('Error finding user by email:', err);
         throw err;
      }
   }

   static async findById(id) {
      try {
         const connection = database.getConnection();
         const [rows] = await connection.query(
            'SELECT * FROM users WHERE id = ? LIMIT 1',
            [id]
         );
         return rows[0] || null;
      } catch (err) {
         console.error('Error finding user by id:', err);
         throw err;
      }
   }
}

export default User;