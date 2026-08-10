'use client'
import React from 'react'

export default function ContactPage() {
    return (
        <div className="mx-auto max-w-5xl my-28 px-6">
            <h1 className="text-4xl font-bold text-slate-800 mb-6">Contact Us</h1>
            <div className="grid md:grid-cols-2 gap-10">
                <div>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        We would love to hear from you. Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
                    </p>
                    <ul className="space-y-4 text-slate-600">
                        <li><strong>Email:</strong> contact@example.com</li>
                        <li><strong>Phone:</strong> +1-212-456-7890</li>
                        <li><strong>Address:</strong> 794 Francisco, 94102</li>
                    </ul>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl">
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-neutral-900" placeholder="Your Name" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-neutral-900" placeholder="your@email.com" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                            <textarea rows="4" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-neutral-900" placeholder="How can we help?" required></textarea>
                        </div>
                        <button type="button" onClick={() => alert("Message sent!")} className="w-full bg-neutral-900 text-white font-semibold py-2 rounded-lg hover:bg-neutral-800 transition">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
