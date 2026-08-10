import { NextResponse } from 'next/server';
import { productDummyData } from '@/assets/assets';
import { getConnection } from '@/lib/db';

export async function GET() {
    try {
        const db = await getConnection();
        
        // Clear existing products
        await db.execute('DELETE FROM Products');
        
        for (const product of productDummyData) {
            const imagesJson = JSON.stringify(product.images);
            const storeJson = JSON.stringify(product.store);
            const ratingJson = JSON.stringify(product.rating);
            
            await db.execute(`
                INSERT INTO Products 
                (id, name, description, mrp, price, images, category, store_id, in_stock, store, rating, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                product.id,
                product.name,
                product.description,
                product.mrp,
                product.price,
                imagesJson,
                product.category,
                product.storeId,
                product.inStock ? 1 : 0,
                storeJson,
                ratingJson,
                product.createdAt,
                product.updatedAt
            ]);
        }
        
        return NextResponse.json({ message: 'Seeded successfully', count: productDummyData.length });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
