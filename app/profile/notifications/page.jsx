'use client'
import React, { useState } from 'react'
import { Bell } from 'lucide-react'

const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
        <div>
            <p className="font-semibold text-slate-800 text-sm">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
        <button 
            onClick={onChange}
            className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-neutral-900' : 'bg-slate-300'}`}
        >
            <div className={`size-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${checked ? 'left-5' : 'left-0.5'}`}></div>
        </button>
    </div>
)

export default function NotificationsPage() {
    const [emailAlerts, setEmailAlerts] = useState(true)
    const [orderUpdates, setOrderUpdates] = useState(true)
    const [promotions, setPromotions] = useState(false)

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[500px]">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-8">
                <Bell size={22} className="text-neutral-900" /> Notifications
            </h2>
            
            <div className="max-w-2xl space-y-4">
                <Toggle 
                    label="Order Updates" 
                    description="Receive email and SMS notifications about your order status and shipping."
                    checked={orderUpdates}
                    onChange={() => setOrderUpdates(!orderUpdates)}
                />
                <Toggle 
                    label="Account Alerts" 
                    description="Get notified about important security updates and account changes."
                    checked={emailAlerts}
                    onChange={() => setEmailAlerts(!emailAlerts)}
                />
                <Toggle 
                    label="Promotional Emails" 
                    description="Receive exclusive offers, product recommendations, and newsletter updates."
                    checked={promotions}
                    onChange={() => setPromotions(!promotions)}
                />
            </div>
        </div>
    )
}
