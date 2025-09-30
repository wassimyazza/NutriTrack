import database from '../../database/db.js';

class User {
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
}

export default User;
