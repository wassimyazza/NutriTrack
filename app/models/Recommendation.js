import database from '../../database/db.js';
import Model from './Model.js';

export default class Recommendation extends Model {
   static table = 'recommendations';

   static async getLastThreeByUserId(userId) {
      const connection = database.getConnection();
      const [rows] = await connection.query(
         `  SELECT r.*, m.name
            FROM user_meals um
            JOIN meals m ON um.meal_id = m.id
            JOIN recommendations r ON m.id = r.meal_id
            WHERE um.user_id = ?
            ORDER BY r.created_at DESC
            LIMIT 3;`,
         [userId]
      );
      return rows;
   }
}
