import React from 'react'
import PageTitle from '@/components/PageTitle'
import Link from 'next/link'

export default function RecommendationsPage() {
    return (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto">
                <PageTitle heading="AI Recommendations" text="Personalized just for you" />
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-10">
                    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Discover Your Next Gadget</h2>
                        <p className="text-slate-500 mb-8">
                            Based on your browsing history, past purchases, and preferences, our AI curates a personalized list of products you'll love.
                        </p>
                        
                        <Link href="/shop" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition">
                            Generate My List
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
