const bcrypt = require('bcryptjs');
const db = require('../config/database');

class User {
  static async create({ fullname, collage_email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (fullname, collage_email, password) VALUES (?, ?, ?)',
      [fullname, collage_email, hashedPassword]
    );
    return result.insertId;
  }

  static async findByEmail(collage_email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE collage_email = ?',
      [collage_email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

// Create users table if it doesn't exist
const initializeTable = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        fullname VARCHAR(255) NOT NULL,
        collage_email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table initialized successfully');
  } catch (error) {
    console.error('Error initializing users table:', error);
  }
};

initializeTable();

module.exports = User;
