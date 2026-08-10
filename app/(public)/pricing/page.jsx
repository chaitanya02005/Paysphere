import React from 'react'
import Link from 'next/link'

export default function PricingPage() {
    return (
        <div className='mx-auto max-w-5xl my-28 px-6'>
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-slate-800 mb-4">Become a Plus Member</h1>
                <p className="text-slate-600">Unlock exclusive benefits, free shipping, and early access to sales.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-[700px] mx-auto">
                {/* Basic Plan */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Basic</h2>
                    <p className="text-slate-500 mb-6 text-sm">Standard shopping experience.</p>
                    <div className="text-4xl font-bold text-slate-800 mb-6">$0<span className="text-lg text-slate-500 font-normal">/month</span></div>
                    <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-600">
                        <li className="flex items-center gap-3">✓ Standard Shipping</li>
                        <li className="flex items-center gap-3">✓ 30-Day Returns</li>
                        <li className="flex items-center gap-3">✓ Basic Support</li>
                    </ul>
                    <Link href="/shop" className="block text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 rounded-full transition">Start Shopping</Link>
                </div>
                
                {/* Plus Plan */}
                <div className="bg-neutral-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(34,197,94,0.3)] text-white flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                    <h2 className="text-2xl font-bold mb-2">PaySphere Plus</h2>
                    <p className="text-green-100 mb-6 text-sm">For the ultimate tech enthusiasts.</p>
                    <div className="text-4xl font-bold mb-6">$9.99<span className="text-lg text-green-200 font-normal">/month</span></div>
                    <ul className="space-y-4 mb-8 flex-1 text-sm text-green-50">
                        <li className="flex items-center gap-3">✓ Free Express Shipping</li>
                        <li className="flex items-center gap-3">✓ 90-Day Returns</li>
                        <li className="flex items-center gap-3">✓ Priority 24/7 Support</li>
                        <li className="flex items-center gap-3">✓ Early Access to Deals</li>
                        <li className="flex items-center gap-3">✓ Exclusive Plus Discounts</li>
                    </ul>
                    <button className="w-full bg-white text-neutral-800 hover:bg-neutral-50 font-bold py-3 rounded-full transition shadow-md">Subscribe Now</button>
                </div>
            </div>
        </div>
    )
}