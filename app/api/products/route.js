import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
    try {
        const db = await getConnection();
        
        const [rows] = await db.execute('SELECT * FROM Products');
        
        const products = rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            mrp: parseFloat(row.mrp),
            price: parseFloat(row.price),
            images: row.images ? JSON.parse(row.images) : [],
            category: row.category,
            storeId: row.store_id,
            inStock: Boolean(row.in_stock),
            store: row.store ? JSON.parse(row.store) : null,
            rating: row.rating ? JSON.parse(row.rating) : [],
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
        
        return NextResponse.json({ success: true, products });
    } catch (e) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
