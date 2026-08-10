import React from 'react'
import PageTitle from '@/components/PageTitle'

export default function PricePredictionPage() {
    return (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto">
                <PageTitle heading="AI Price Prediction" text="Know exactly when to buy" />
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-10">
                    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Track & Predict Price Drops</h2>
                        <p className="text-slate-500 mb-8">
                            Our AI analyzes historical pricing data, upcoming sales events, and market trends to predict when a product's price will drop next.
                        </p>
                        
                        <div className="w-full flex gap-4">
                            <input type="text" placeholder="Paste product URL or name..." className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500" />
                            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition">Predict</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
