import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

class Database {
   #connection;

   constructor(config) {
      this.config = config;
      this.#connection = null;
   }

   // méthode pour se connecter
   async connect() {
      try {
         this.#connection = await mysql.createConnection(this.config);
         console.log('Connecté à la base de données !');
         return this.#connection;
      } catch (err) {
         console.error(
            'Erreur de connexion à la base de données :',
            err.message
         );
         process.exit(1);
      }
   }

   // getter pour récupérer la connexion
   getConnection() {
      if (!this.#connection) {
         throw new Error(
            'La connexion à la base de données nest pas initialisée.'
         );
      }
      return this.#connection;
   }

   // initialize the database
   async init() {
      try {
         const [result] = await this.getConnection().query(
            'SHOW DATABASES LIKE "NutriTrack";'
         );

         if (!result.length) {
            console.log('Creating database and tables...');
            await this.getConnection().query(`
               CREATE DATABASE IF NOT EXISTS NutriTrack;
            `);

            await this.getConnection().query('USE NutriTrack;');

            await this.getConnection().query(`
               CREATE TABLE users (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  name VARCHAR(100) NOT NULL,
                  email VARCHAR(150) UNIQUE NOT NULL,
                  password VARCHAR(255) NOT NULL,
                  age INT,
                  gender ENUM('male', 'female') DEFAULT 'male',
                  height DECIMAL(5,2),
                  weight DECIMAL(5,2),
                  activity_level ENUM('low','medium','high'),
                  goal VARCHAR(100),
                  condition_user ENUM('diabetes', 'hypertension', 'obesity', 'athlete') NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
               );
            `);

            await this.getConnection().query(`
               CREATE TABLE meals (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  name VARCHAR(100) NOT NULL,
                  calories DECIMAL(6,2),
                  proteins DECIMAL(6,2),
                  carbs DECIMAL(6,2),
                  fats DECIMAL(6,2),
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
               );
            `);

            await this.getConnection().query(`
               CREATE TABLE user_meals (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  user_id INT NOT NULL,
                  meal_id INT NOT NULL,
                  date DATE NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                  FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
               );
            `);

            await this.getConnection().query(`
               CREATE TABLE recommendations (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  meal_id INT NOT NULL,
                  recommendation_text VARCHAR(255) NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
               );
            `);

            // insert fake data
            await this.getConnection().query(`
               INSERT INTO users (name, email, password, age, gender, height, weight, activity_level, goal, condition_user)
               VALUES
               ('John Doe', 'john@example.com', '$2y$12$V9FJ9kTJ3VzDMPjl3X232.L52KqFTbVaOBAKtt8Q9ZGLxL0FC4XW.', 35, 'male', 175.00, 85.00, 'medium', 'Lose weight', 'obesity'),
               ('Jane Smith', 'jane@example.com', '$2y$12$V9FJ9kTJ3VzDMPjl3X232.L52KqFTbVaOBAKtt8Q9ZGLxL0FC4XW.', 29, 'female', 162.00, 70.00, 'low', 'Control diabetes', 'diabetes'),
               ('Mike Johnson', 'mike@example.com', '$2y$12$V9FJ9kTJ3VzDMPjl3X232.L52KqFTbVaOBAKtt8Q9ZGLxL0FC4XW.', 40, 'male', 180.00, 95.00, 'high', 'Improve performance', 'athlete'),
               ('Sara Lee', 'sara@example.com', '$2y$12$V9FJ9kTJ3VzDMPjl3X232.L52KqFTbVaOBAKtt8Q9ZGLxL0FC4XW.', 32, 'female', 168.00, 72.00, 'medium', 'Lose weight', 'hypertension');
            `);

            await this.getConnection().query(`
               INSERT INTO meals (name, calories, proteins, carbs, fats) VALUES
               ('Oatmeal with Milk', 350, 12, 55, 8),
               ('Grilled Chicken Salad', 400, 35, 20, 15),
               ('Banana Smoothie', 200, 5, 40, 2),
               ('Protein Shake', 250, 25, 10, 5);
            `);

            await this.getConnection().query(`
               INSERT INTO user_meals (user_id, meal_id, date) VALUES
               (1, 1, '2025-09-29'),
               (1, 2, '2025-09-29'),
               (2, 3, '2025-09-29'),
               (3, 4, '2025-09-29');
            `);

            await this.getConnection().query(`
               INSERT INTO recommendations (meal_id, recommendation_text)
               VALUES
               (1, 'Add more vegetables'),
               (1, 'Reduce salt intake'),
               (2, 'Add more protein'),
               (2, 'Watch sugar levels');
            `);

            console.log('Database initialized successfully!');
         } else {
            await this.getConnection().query('USE NutriTrack;');
            console.log('Database already exists, using NutriTrack');
         }
      } catch (err) {
         console.error('Error initializing database:', err);
         throw err;
      }
   }
}

// Configuration de la base de données
const dbConfig = {
   host: process.env.DB_HOST || 'localhost',
   user: process.env.DB_USER || 'root',
   password: process.env.DB_PASSWORD || '',
   database: process.env.DB_NAME || 'NutriTrack',
};

const database = new Database(dbConfig);
// connexion lors du démarrage
await database.connect();
await database.init();
export default database;
