import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(req) {
    try {
        const body = await req.json();
        const { id, user_id, name, email, street, city, state, zip, country, phone } = body;

        if (!id || !user_id || !name || !street || !city || !state || !zip || !country) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const pool = await getConnection();
        
        // Auto-create user if they don't exist in MySQL (e.g. from an old session before Google Login sync was added)
        const [userRows] = await pool.execute('SELECT id FROM Users WHERE id = ?', [user_id]);
        if (userRows.length === 0) {
            const insertUserQuery = `
                INSERT INTO Users (id, name, email, password_hash)
                VALUES (?, ?, ?, ?)
            `;
            await pool.execute(insertUserQuery, [user_id, name || 'Unknown User', `temp_${user_id}@paysphere.internal`, 'auto-generated-stub']);
        }
        const query = `
            INSERT INTO Addresses (id, user_id, name, email, street, city, state, zip, country, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await pool.execute(query, [id, user_id, name, email || null, street, city, state, zip, country, phone || null]);

        return NextResponse.json({ success: true, message: 'Address added successfully' }, { status: 201 });

    } catch (error) {
        console.error('Error adding address:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, user_id, name, email, street, city, state, zip, country, phone } = body;

        if (!id || !user_id || !name || !street || !city || !state || !zip || !country) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const pool = await getConnection();
        
        const query = `
            UPDATE Addresses 
            SET name=?, email=?, street=?, city=?, state=?, zip=?, country=?, phone=?
            WHERE id=? AND user_id=?
        `;
        
        await pool.execute(query, [name, email || null, street, city, state, zip, country, phone || null, id, user_id]);

        return NextResponse.json({ success: true, message: 'Address updated successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error updating address:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
