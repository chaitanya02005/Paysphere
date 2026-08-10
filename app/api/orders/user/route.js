import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { productDummyData } from '@/assets/assets';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get('uid');

        if (!uid) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const pool = await getConnection();

        // Fetch Orders for the user
        const [orders] = await pool.query(
            `SELECT * FROM Orders WHERE user_id = ? ORDER BY created_at DESC`,
            [uid]
        );

        if (orders.length === 0) {
            return NextResponse.json({ success: true, orders: [] }, { status: 200 });
        }

        // Fetch all order items and addresses for these orders
        const orderIds = orders.map(o => o.id);
        
        // Since IN clause needs placeholders, we create them dynamically
        const placeholders = orderIds.map(() => '?').join(',');
        
        const [orderItems] = await pool.query(
            `SELECT * FROM OrderItems WHERE order_id IN (${placeholders})`,
            orderIds
        );

        // Fetch addresses
        const addressIds = [...new Set(orders.map(o => o.address_id))];
        let addresses = [];
        if (addressIds.length > 0) {
            const addrPlaceholders = addressIds.map(() => '?').join(',');
            const [fetchedAddresses] = await pool.query(
                `SELECT * FROM Addresses WHERE id IN (${addrPlaceholders})`,
                addressIds
            );
            addresses = fetchedAddresses;
        }

        // Assemble the data
        const assembledOrders = orders.map(order => {
            const address = addresses.find(a => a.id === order.address_id) || {};
            const items = orderItems.filter(item => item.order_id === order.id).map(item => {
                // Map the dummy product data based on product_id
                const productData = productDummyData.find(p => p.id === item.product_id) || {
                    id: item.product_id,
                    name: 'Unknown Product',
                    images: ['']
                };
                return {
                    price: item.price,
                    quantity: item.quantity,
                    product: {
                        ...productData,
                        images: productData.images.map(img => img.src || img)
                    }
                };
            });

            return {
                id: order.id,
                total: order.total,
                status: order.status || order.order_status || 'order_placed',
                createdAt: order.created_at,
                address: {
                    name: address.name || '',
                    street: address.street || '',
                    city: address.city || '',
                    state: address.state || '',
                    zip: address.zip || '',
                    country: address.country || 'India',
                    phone: address.phone || ''
                },
                orderItems: items
            };
        });

        return NextResponse.json({ success: true, orders: assembledOrders }, { status: 200 });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
