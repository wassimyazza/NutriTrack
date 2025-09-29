import database from '../../database/db.js';

export default class User {
    static table = "users";

    static findByEmail(email, callback) {
        const db = database.getConnection();
        db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    }

    static create(data, callback) {
        const db = database.getConnection();
        db.query('INSERT INTO users SET ?', data, (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    }
}
