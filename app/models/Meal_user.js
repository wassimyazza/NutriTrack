import Model from './Model.js';
import database from '../../database/db.js';

export default class Meal_user extends Model {
   static table = 'user_meals';

   static async findByUser(user_id) {
      const connection = database.getConnection();
      const [rows] = await connection.query(
         `
            SELECT 
                
                user_meals.id AS user_meal_id,
                user_meals.date,
                user_meals.created_at AS user_meal_created,

                users.id AS user_id,
                users.name AS user_name,
                users.email AS user_email,
                users.gender,
                users.age,
                users.goal,
                users.condition_user,

                meals.id AS meal_id,
                meals.name AS meal_name,
                meals.image_path,
                meals.calories,
                meals.proteins,
                meals.carbs,
                meals.fats,
                meals.created_at AS meal_created
            FROM user_meals
            JOIN users ON users.id = user_meals.user_id
            JOIN meals ON meals.id = user_meals.meal_id
            WHERE user_meals.user_id = ?
            ORDER BY user_meals.date DESC, user_meals.created_at DESC
            `,
         [user_id]
      );
      return rows;
   }
}
