import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getConnection } from '@/lib/db';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req) {
    try {
        const payload = await req.text(); // Get raw body for signature verification
        const signature = req.headers.get('x-razorpay-signature');

        if (!signature) {
            return NextResponse.json({ error: 'Missing Razorpay signature' }, { status: 400 });
        }

        // Verify the webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
            .update(payload)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error('Invalid Webhook Signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Parse the body now that it's verified
        const event = JSON.parse(payload);

        if (event.event === 'payment.captured' || event.event === 'order.paid') {
            let razorpay_order_id;
            let razorpay_payment_id;
            let amount;
            
            if (event.event === 'order.paid') {
                razorpay_order_id = event.payload.order.entity.id;
                razorpay_payment_id = event.payload.payment?.entity?.id;
                amount = event.payload.order.entity.amount / 100; // Razorpay sends amount in paise
            } else {
                razorpay_order_id = event.payload.payment.entity.order_id;
                razorpay_payment_id = event.payload.payment.entity.id;
                amount = event.payload.payment.entity.amount / 100;
            }

            const pool = await getConnection();

            // Find our internal order ID based on the razorpay_order_id
            // In a real system, you'd store the razorpay_order_id in the Orders table when creating it.
            // Since we don't have it explicitly mapped in the DB yet, we check the Payments table
            // or if it's sent in Notes. Let's assume order_id was passed in notes when order was created.
            
            const internal_order_id = event.payload.payment?.entity?.notes?.order_id || event.payload.order?.entity?.receipt;

            if (!internal_order_id) {
                // Cannot process without internal order ID mapping
                console.error('Missing internal order ID in webhook payload');
                return NextResponse.json({ error: 'Unprocessable Entity' }, { status: 422 });
            }

            // Idempotency check: see if order is already marked as paid
            const [existingOrder] = await pool.query(`SELECT is_paid, user_id FROM Orders WHERE id = ?`, [internal_order_id]);
            if (existingOrder.length > 0 && existingOrder[0].is_paid) {
                // If the frontend already processed it, just return success to Razorpay
                return NextResponse.json({ success: true, message: 'Already verified' }, { status: 200 });
            }

            const user_id = existingOrder[0]?.user_id;

            // Update Order to paid
            await pool.execute(
                `UPDATE Orders SET is_paid = TRUE, status = 'ORDER_PLACED' WHERE id = ?`,
                [internal_order_id]
            );

            // Insert into Payments table
            const payment_id = 'PAY_' + Date.now() + Math.floor(Math.random() * 1000);
            await pool.execute(
                `INSERT INTO Payments (id, order_id, user_id, amount, currency, provider, provider_transaction_id, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [payment_id, internal_order_id, user_id, amount, 'INR', 'RAZORPAY', razorpay_payment_id, 'SUCCESSFUL']
            );

            // Fetch User Details to send email
            const [users] = await pool.query(`SELECT email, name FROM Users WHERE id = ?`, [user_id]);
            if (users.length > 0) {
                const user = users[0];
                if (user.email) {
                    sendOrderConfirmationEmail(user.email, user.name, {
                        order_id: internal_order_id,
                        total: amount,
                        payment_method: 'RAZORPAY'
                    }).catch(console.error);
                }
            }
        }

        // Return a 200 OK to acknowledge receipt of the webhook
        return NextResponse.json({ status: 'ok' }, { status: 200 });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
