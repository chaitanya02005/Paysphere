import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getConnection } from '@/lib/db';

export async function POST(req) {
    try {
        const body = await req.json();
        const { uid, name, email, phone, password } = body;

        if (!uid || !name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Get database connection
        const pool = await getConnection();

        // Insert into Users table
        const query = `
            INSERT INTO Users (id, name, email, password_hash, phone_number)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        await pool.execute(query, [uid, name, email, passwordHash, phone || null]);

        return NextResponse.json({ success: true, message: 'User stored in MySQL successfully' }, { status: 201 });

    } catch (error) {
        console.error('Error saving user to MySQL:', error);
        
        // Handle duplicate email error gracefully
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'Email already exists in database' }, { status: 409 });
        }
        
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
