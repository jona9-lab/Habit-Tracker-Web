import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

async function testConnection() {
    try {
        const [rows] = await pool.query("SELECT 1");
        console.log("Database connected successfully:", rows);
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

testConnection();

// Add a new habit
export async function addHabit(name, frequency, goal_days) {
    const [result] = await pool.query(`
        INSERT INTO habits (name, frequency, goal_days)
        VALUES (?, ?, ?)
    `, [name, frequency, goal_days]);
    return getHabit(result.insertId);
}

// Log completion of a habit (increment streak & update last_completed)
export async function logCompletion(id) {
    const [result] = await pool.query(`
        UPDATE habits
        SET streak = streak + 1, last_completed = NOW()
        WHERE id = ?
    `, [id]);
    return result;
}

// Edit a habit
export async function editHabit(id, name, frequency, goal_days) {
    const [result] = await pool.query(`
        UPDATE habits
        SET name = ?, frequency = ?, goal_days = ?
        WHERE id = ?
    `, [name, frequency, goal_days, id]);
    return result;
}

// Delete a habit
export async function deleteHabit(id) {
    const [result] = await pool.query(`
        DELETE FROM habits
        WHERE id = ?
    `, [id]);
    return result;
}

// View all habit streaks
export async function viewStreaks() {
    const [rows] = await pool.query(`
        SELECT id, name, streak FROM habits
    `);
    return rows;
}

// Reset a habit (streak reset & last_completed reset)
export async function resetHabit(id) {
    const [result] = await pool.query(`
        UPDATE habits
        SET streak = 0, last_completed = NULL
        WHERE id = ?
    `, [id]);
    return result;
}