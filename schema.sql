-- E-commerce Database Schema (MySQL)

CREATE DATABASE IF NOT EXISTS paysphere;
USE paysphere;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS Users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- To store bcrypt passwords
    phone_number VARCHAR(20),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Stores Table (for sellers)
CREATE TABLE IF NOT EXISTS Stores (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    username VARCHAR(100) UNIQUE NOT NULL,
    address TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    is_active BOOLEAN DEFAULT FALSE,
    logo VARCHAR(255),
    email VARCHAR(255),
    contact VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS Products (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    mrp DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    images JSON, -- Storing an array of image URLs
    category VARCHAR(100),
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES Stores(id) ON DELETE CASCADE
);

-- 4. Addresses Table
CREATE TABLE IF NOT EXISTS Addresses (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS Orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    store_id VARCHAR(50) NOT NULL,
    address_id VARCHAR(50) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'ORDER_PLACED',
    is_paid BOOLEAN DEFAULT FALSE,
    payment_method ENUM('COD', 'STRIPE', 'PAYPAL', 'CREDIT_CARD', 'RAZORPAY') NOT NULL,
    is_coupon_used BOOLEAN DEFAULT FALSE,
    coupon_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES Stores(id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES Addresses(id)
);

-- 6. OrderItems Table
CREATE TABLE IF NOT EXISTS OrderItems (
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);

-- 7. Payments Table (New Table for real e-commerce tracking)
CREATE TABLE IF NOT EXISTS Payments (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    provider ENUM('STRIPE', 'PAYPAL', 'RAZORPAY') NOT NULL,
    provider_transaction_id VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('PENDING', 'SUCCESSFUL', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    refund_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
