import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get('uid');

        if (!uid) {
            return NextResponse.json({ error: 'Missing UID' }, { status: 400 });
        }

        const pool = await getConnection();
        
        // Fetch User and their default address if exists
        const userQuery = `SELECT id, name, email, phone_number FROM Users WHERE id = ?`;
        const [userRows] = await pool.execute(userQuery, [uid]);

        if (userRows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = userRows[0];

        const addressQuery = `SELECT * FROM Addresses WHERE user_id = ? ORDER BY created_at DESC`;
        const [addressRows] = await pool.execute(addressQuery, [uid]);

        return NextResponse.json({
            success: true,
            user: {
                ...user,
                addresses: addressRows
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching profile data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
