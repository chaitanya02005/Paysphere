import React from 'react'
import PageTitle from '@/components/PageTitle'

export default function ProductComparisonPage() {
    return (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto">
                <PageTitle heading="AI Product Comparison" text="Let AI help you choose the best product" />
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-10">
                    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-neutral-100 text-neutral-800 rounded-full flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Compare Products Intelligently</h2>
                        <p className="text-slate-500 mb-8">
                            Select up to 3 products and our AI will analyze specs, reviews, and pricing to give you a comprehensive comparison and recommendation.
                        </p>
                        
                        <div className="w-full flex gap-4">
                            <input type="text" placeholder="Search for a product to add..." className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-neutral-900" />
                            <button className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 rounded-xl font-semibold transition">Add</button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 w-full mt-10 opacity-50">
                            <div className="border border-dashed border-slate-300 rounded-xl p-8 flex items-center justify-center text-slate-400">Empty Slot</div>
                            <div className="border border-dashed border-slate-300 rounded-xl p-8 flex items-center justify-center text-slate-400">Empty Slot</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
