import { NextResponse } from 'next/server';
import { sendNewsletterSubscriptionEmail } from '@/lib/email';

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
        }

        // Normally, you would save the email to a database table like `NewsletterSubscribers` here.
        // For now, we will just send the subscription confirmation email.

        const emailResult = await sendNewsletterSubscriptionEmail(email);

        if (emailResult.success) {
            return NextResponse.json({ success: true, message: 'Subscription successful!' }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 });
        }

    } catch (error) {
        console.error('Newsletter API error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
