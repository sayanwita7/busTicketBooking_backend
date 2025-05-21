import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

let connection;
const connectDB = async () => {
    try {
        connection = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            });
        console.log("✅ MySQL connected successfully in index.");
        return connection;
    } catch (err) {
        console.error("❌ MySQL connection failed in index:", err);
        throw err;
    }
};

const getConnection = async () => {
    await connectDB()
    if (!connection) {
        throw new Error("⚠️ Database not connected. Call connectDB() first.");
    }
    return connection;
};
export { connectDB, getConnection };
