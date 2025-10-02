import Model from './Model.js';
import database from '../../database/db.js';

export default class Meal extends Model {
    static table = 'meals';

    static async createWithRecommendations(mealData, recommendations) {
        const connection = database.getConnection();
        
        try {
            const meal = await this.create(mealData);
            
            if (recommendations && recommendations.length > 0) {
                for (const rec of recommendations) {
                    await connection.query(
                        'INSERT INTO recommendations (meal_id, recommendation_text) VALUES (?, ?)',
                        [meal.id, rec]
                    );
                }
            }
            
            return meal;
        } catch (err) {
            console.error('Error creating meal with recommendations:', err);
            throw err;
        }
    }

    static async findByUserId(userId) {
        try {
            const connection = database.getConnection();
            const [rows] = await connection.query(
                'SELECT * FROM meals WHERE user_id = ? ORDER BY created_at DESC',
                [userId]
            );
            return rows;
        } catch (err) {
            console.error('Error finding meals:', err);
            throw err;
        }
    }
}