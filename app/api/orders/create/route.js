import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import Razorpay from 'razorpay';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req) {
    let connection;
    try {
        const body = await req.json();
        const { user_id, user_email, user_name, address_id, items, total, payment_method, coupon_data } = body;

        if (!user_id || !address_id || !items || items.length === 0 || !total || !payment_method) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const pool = await getConnection();
        connection = await pool.getConnection();
        
        await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

        // For dummy products without store_id
        const store_id = items[0].store_id || 'default_store'; 
        const order_id = 'ORD_' + Date.now() + Math.floor(Math.random() * 1000);

        const orderQuery = `
            INSERT INTO Orders (id, user_id, store_id, address_id, total, payment_method, is_coupon_used, coupon_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const is_coupon_used = !!coupon_data;
        
        await connection.execute(orderQuery, [
            order_id, user_id, store_id, address_id, total, payment_method, 
            is_coupon_used, is_coupon_used ? JSON.stringify(coupon_data) : null
        ]);

        for (const item of items) {
            await connection.execute(
                `INSERT INTO OrderItems (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
                [order_id, item.id, item.quantity, item.price]
            );
        }

        await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
        connection.release();

        if (payment_method === 'RAZORPAY') {
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });

            const amountInPaise = Math.round(total * 100);

            const options = {
                amount: amountInPaise,
                currency: "INR", 
                receipt: order_id,
            };

            const razorpayOrder = await razorpay.orders.create(options);

            return NextResponse.json({ 
                success: true, 
                order_id: order_id,
                razorpay_order_id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key_id: process.env.RAZORPAY_KEY_ID
            }, { status: 200 });
        }

        if (user_email) {
            sendOrderConfirmationEmail(user_email, user_name, {
                order_id: order_id,
                total: total,
                payment_method: payment_method
            }).catch(console.error);
        }

        return NextResponse.json({ success: true, order_id: order_id }, { status: 200 });

    } catch (error) {
        if (connection) {
            await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
            connection.release();
        }
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
