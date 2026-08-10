import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Global connection pool equivalent
let dbPromise = null;

export async function getConnection() {
    if (!dbPromise) {
        dbPromise = open({
            filename: path.join(process.cwd(), 'database.sqlite'),
            driver: sqlite3.Database
        }).then(async (db) => {
            // Initialize tables if they don't exist
            await db.exec(`
                CREATE TABLE IF NOT EXISTS Users (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    phone_number VARCHAR(50),
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS Addresses (
                    id VARCHAR(255) PRIMARY KEY,
                    user_id VARCHAR(255) NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255),
                    phone VARCHAR(50),
                    street TEXT NOT NULL,
                    city VARCHAR(100) NOT NULL,
                    state VARCHAR(100) NOT NULL,
                    zip VARCHAR(50) NOT NULL,
                    country VARCHAR(100) NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS Orders (
                    id VARCHAR(255) PRIMARY KEY,
                    user_id VARCHAR(255) NOT NULL,
                    store_id VARCHAR(255) NOT NULL,
                    address_id VARCHAR(255) NOT NULL,
                    total DECIMAL(10, 2) NOT NULL,
                    payment_method VARCHAR(50) NOT NULL,
                    payment_status VARCHAR(50) DEFAULT 'Pending',
                    order_status VARCHAR(50) DEFAULT 'Processing',
                    is_coupon_used BOOLEAN DEFAULT 0,
                    coupon_data TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE,
                    FOREIGN KEY(address_id) REFERENCES Addresses(id) ON DELETE SET NULL
                );

                CREATE TABLE IF NOT EXISTS OrderItems (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_id VARCHAR(255) NOT NULL,
                    product_id VARCHAR(255) NOT NULL,
                    quantity INTEGER NOT NULL,
                    price DECIMAL(10, 2) NOT NULL,
                    FOREIGN KEY(order_id) REFERENCES Orders(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS Products (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    mrp DECIMAL(10, 2),
                    price DECIMAL(10, 2),
                    images TEXT,
                    category VARCHAR(100),
                    store_id VARCHAR(255),
                    in_stock BOOLEAN DEFAULT 1,
                    store TEXT,
                    rating TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);
            
            // Compatibility wrapper for MySQL syntax so API changes are minimal
            db.execute = async (sql, params = []) => {
                // Mock foreign key checks since SQLite uses PRAGMA
                if (sql.includes('SET FOREIGN_KEY_CHECKS = 0')) {
                    sql = 'PRAGMA foreign_keys = OFF;';
                } else if (sql.includes('SET FOREIGN_KEY_CHECKS = 1')) {
                    sql = 'PRAGMA foreign_keys = ON;';
                }
                
                try {
                    const results = await db.all(sql, params);
                    return [results]; // Wrapping in array to simulate MySQL [rows] return
                } catch (e) {
                    // db.all fails on INSERT/UPDATE in some sqlite wrappers, so fallback to run
                    const result = await db.run(sql, params);
                    return [[]]; // return empty rows for insert/update
                }
            };

            db.query = db.execute;
            db.getConnection = async () => db;
            db.release = () => {};
            
            return db;
        });
    }
    return dbPromise;
}

