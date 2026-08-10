import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import crypto from 'crypto';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req) {
    try {
        const body = await req.json();
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, order_id, user_id, user_email, user_name, amount } = body;

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !order_id || !user_id || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const pool = await getConnection();

        // Idempotency check: see if order is already marked as paid
        const [existingOrder] = await pool.query(`SELECT is_paid FROM Orders WHERE id = ?`, [order_id]);
        if (existingOrder.length > 0 && existingOrder[0].is_paid) {
            // If the webhook already processed it, just return success
            return NextResponse.json({ success: true, message: 'Already verified' }, { status: 200 });
        }

        // Update Order to paid
        await pool.execute(
            `UPDATE Orders SET is_paid = TRUE, status = 'ORDER_PLACED' WHERE id = ?`,
            [order_id]
        );

        // Insert into Payments table
        const payment_id = 'PAY_' + Date.now() + Math.floor(Math.random() * 1000);
        await pool.execute(
            `INSERT INTO Payments (id, order_id, user_id, amount, currency, provider, provider_transaction_id, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [payment_id, order_id, user_id, amount, 'INR', 'RAZORPAY', razorpay_payment_id, 'SUCCESSFUL']
        );

        if (user_email) {
            sendOrderConfirmationEmail(user_email, user_name, {
                order_id: order_id,
                total: amount,
                payment_method: 'RAZORPAY'
            }).catch(console.error);
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
