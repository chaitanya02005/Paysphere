'use client'
import React from 'react'
import { CreditCard, Plus } from 'lucide-react'

export default function PaymentMethodsPage() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <CreditCard size={22} className="text-neutral-900" /> Payment Methods
                </h2>
                <button className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm">
                    <Plus size={16} /> Add New Card
                </button>
            </div>
            
            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                <div className="size-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <CreditCard size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">No payment methods saved</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                    Save your credit or debit cards here to make future checkouts faster and more secure.
                </p>
            </div>
        </div>
    )
}
