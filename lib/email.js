import nodemailer from 'nodemailer';

export const sendOrderConfirmationEmail = async (toEmail, userName, orderDetails) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: `Order Confirmation - ${orderDetails.order_id}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Thank you for your order, ${userName || 'Customer'}!</h2>
                    <p>We've received your order and are getting it ready to ship.</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3>Order Summary</h3>
                        <p><strong>Order ID:</strong> ${orderDetails.order_id}</p>
                        <p><strong>Total Amount:</strong> ₹${orderDetails.total}</p>
                        <p><strong>Payment Method:</strong> ${orderDetails.payment_method}</p>
                    </div>
                    <p>We'll send you another email when your order ships.</p>
                    <br/>
                    <p>Best regards,<br/>The PaySphere Team</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, info };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

export const sendNewsletterSubscriptionEmail = async (toEmail) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: 'Welcome to PaySphere Newsletter!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Thank you for subscribing!</h2>
                    <p>You have successfully subscribed to the PaySphere Newsletter.</p>
                    <p>Get ready to receive exclusive deals, new arrivals, and the latest stock updates delivered straight to your inbox.</p>
                    <div style="background: #eef2ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Stay tuned! Our next update is coming soon.</strong></p>
                    </div>
                    <p>If you did not sign up for this newsletter, please ignore this email.</p>
                    <br/>
                    <p>Best regards,<br/>The PaySphere Team</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, info };
    } catch (error) {
        console.error('Error sending newsletter email:', error);
        return { success: false, error: error.message };
    }
};
