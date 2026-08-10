import React from 'react'

export default function PrivacyPolicyPage() {
    return (
        <div className="mx-auto max-w-5xl my-28 px-6">
            <h1 className="text-4xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
            <div className="prose prose-slate max-w-none text-slate-600">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Information We Collect</h2>
                <p className="mb-4">We collect information that you provide directly to us when you create an account, make a purchase, or contact us for support.</p>
                
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2. How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect to process your transactions, communicate with you, and improve our services.</p>
                
                <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3. Data Security</h2>
                <p className="mb-4">We implement reasonable security measures to protect your personal information from unauthorized access or disclosure.</p>
            </div>
        </div>
    )
}
