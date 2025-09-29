import mysql from 'mysql2';
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
            'La connexion à la base de données n’est pas initialisée.'
         );
      }
      return this.#connection;
   }
}

const dbConfig = {
   host: process.env.DB_HOST || 'localhost',
   user: process.env.DB_USER || 'root',
   password: process.env.DB_PASSWORD || '',
   database: process.env.DB_NAME,
   multipleStatements: true,
};

const database = new Database(dbConfig);
database.connect(); // connect immediately
export default database;
