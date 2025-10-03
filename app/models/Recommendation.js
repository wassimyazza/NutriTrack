import database from '../../database/db.js';
import Model from './Model.js';

export default class Recommendation extends Model {
   static table = 'recommendations';

   static async getLastThreeByUserId(userId) {
      const connection = database.getConnection();
      const [rows] = await connection.query(
         `  SELECT r.id, r.recommendation_text, r.created_at, m.name AS meal_name
            FROM recommendations r
            JOIN meals m ON r.meal_id = m.id
            WHERE m.user_id = ?
            ORDER BY r.created_at DESC
            LIMIT 3;
            `,
         [userId]
      );
      return rows;
   }
}
