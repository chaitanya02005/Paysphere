import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function PUT(req) {
    try {
        const body = await req.json();
        const { uid, phone_number } = body;

        if (!uid || !phone_number) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const pool = await getConnection();
        
        const query = `UPDATE Users SET phone_number = ? WHERE id = ?`;
        await pool.execute(query, [phone_number, uid]);

        return NextResponse.json({ success: true, message: 'Phone number updated successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error updating phone number:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
