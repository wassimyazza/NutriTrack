import database from '../../database/db.js';

export default class Model {
   static table = null; // chaque modèle doit définir sa table

   static async all() {
      const connection = database.getConnection();
      const [rows] = await connection.query(`SELECT * FROM ${this.table}`);
      return rows;
   }

   static async find(id) {
      const connection = database.getConnection();
      const [rows] = await connection.query(
         `SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`,
         [id]
      );
      return rows[0] || null;
   }

   static async create(data) {
      const connection = database.getConnection();
      const [result] = await connection.query(
         `INSERT INTO ${this.table} (${Object.keys(data).join(', ')})
      VALUES (${Object.keys(data)
         .map(() => '?')
         .join(', ')})`,
         Object.values(data)
      );
      return {id: result.insertId, ...data};
   }

   static async update(id, data) {
      const connection = database.getConnection();
      const fields = Object.keys(data)
         .map(key => `${key} = ?`)
         .join(', ');

      await connection.query(
         `UPDATE ${this.table} SET ${fields} WHERE id = ?`,
         [...Object.values(data), id]
      );
      return this.find(id);
   }

   static async delete(id) {
      const connection = database.getConnection();
      await connection.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
      return true;
   }
}
