'use client'
import React, { useState } from 'react'
import { ArrowLeft, Bell, Shield, Key, CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'

const SettingsPage = () => {
    const router = useRouter()
    const [notifications, setNotifications] = useState(true)
    const [marketing, setMarketing] = useState(false)

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium"
                >
                    <ArrowLeft size={20} /> Back
                </button>
                
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    
                    {/* Notifications Section */}
                    <div className="p-6 sm:p-8 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-neutral-50 rounded-lg text-neutral-800">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>
                                <p className="text-sm text-slate-500">Manage how you receive updates and alerts.</p>
                            </div>
                        </div>

                        <div className="space-y-4 ml-12">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-700">Order Updates</p>
                                    <p className="text-xs text-slate-500">Receive emails about your order status.</p>
                                </div>
                                <button 
                                    onClick={() => setNotifications(!notifications)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? 'bg-neutral-900' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-700">Promotions & Marketing</p>
                                    <p className="text-xs text-slate-500">Receive emails about new products and sales.</p>
                                </div>
                                <button 
                                    onClick={() => setMarketing(!marketing)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${marketing ? 'bg-neutral-900' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${marketing ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="p-6 sm:p-8 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">Security</h2>
                                <p className="text-sm text-slate-500">Manage your password and security preferences.</p>
                            </div>
                        </div>

                        <div className="ml-12 space-y-4">
                            <button className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-neutral-800 transition-colors">
                                <Key size={16} /> Change Password
                            </button>
                        </div>
                    </div>
                    
                    {/* Payment Methods */}
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">Payment Methods</h2>
                                <p className="text-sm text-slate-500">Manage your saved credit cards and billing.</p>
                            </div>
                        </div>

                        <div className="ml-12">
                            <p className="text-sm text-slate-500 italic">No saved payment methods yet.</p>
                            <button className="mt-3 text-sm font-semibold text-neutral-900 hover:text-neutral-800 uppercase tracking-wider transition-colors">
                                + Add Payment Method
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SettingsPage
