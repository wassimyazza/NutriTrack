import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

class Database {
    #connection;

    constructor(config) {
        this.config = config;
        this.#connection = null;
    }

    connect(callback) {
        this.#connection = mysql.createConnection(this.config);
        this.#connection.connect(err => {
            if (err) throw err;
            console.log('Database connected!');
            if (callback) callback();
        });
    }

    getConnection() {
        if (!this.#connection) throw new Error('Connection not initialized');
        return this.#connection;
    }
}

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'NutriTrack'
};

const database = new Database(dbConfig);
database.connect(); // connect immediately
export default database;
