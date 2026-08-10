import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function runSchema() {
    try {
        console.log("Connecting to database at", process.env.DB_HOST);
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            multipleStatements: true,
            ssl: {
                rejectUnauthorized: false
            }
        });

        console.log("Connected! Reading schema.sql...");
        const schema = await fs.readFile('schema.sql', 'utf8');
        
        console.log("Executing schema...");
        await connection.query(schema);
        
        console.log("Schema executed successfully!");
        await connection.end();
    } catch (error) {
        console.error("Error executing schema:", error.message);
        process.exit(1);
    }
}

runSchema();
