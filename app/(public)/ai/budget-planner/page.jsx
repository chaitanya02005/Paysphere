import React from 'react'
import PageTitle from '@/components/PageTitle'

export default function BudgetPlannerPage() {
    return (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto">
                <PageTitle heading="AI Budget Planner" text="Plan your tech purchases smartly" />
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mt-10">
                    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Smart Budget Allocation</h2>
                        <p className="text-slate-500 mb-8">
                            Enter your total budget and what kind of devices you need. Our AI will distribute your budget to recommend the perfect ecosystem of products.
                        </p>
                        
                        <form className="w-full space-y-4 text-left">
                            <div>
                                <label className="block text-sm font-medium mb-1">Total Budget ($)</label>
                                <input type="number" placeholder="e.g. 2500" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Required Devices (comma separated)</label>
                                <input type="text" placeholder="e.g. Laptop, Phone, Earbuds" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500" />
                            </div>
                            <button type="button" className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition mt-4">Generate Plan</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
