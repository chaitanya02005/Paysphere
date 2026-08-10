'use client'
import React from 'react'
import { Settings, Shield, Moon, Trash2 } from 'lucide-react'

export default function SettingsPage() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[500px]">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-8">
                <Settings size={22} className="text-neutral-900" /> Account Settings
            </h2>
            
            <div className="max-w-2xl space-y-6">
                
                {/* Security */}
                <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Shield size={16} /> Security
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="text-left">
                                <p className="font-semibold text-slate-800 text-sm">Change Password</p>
                                <p className="text-xs text-slate-500 mt-0.5">Update your password to keep your account secure.</p>
                            </div>
                            <span className="text-sm font-medium text-neutral-900 bg-white px-3 py-1 rounded-md border border-slate-200">Update</span>
                        </button>
                    </div>
                </div>

                {/* Appearance */}
                <div className="pt-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Moon size={16} /> Appearance
                    </h3>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                        <div className="text-left">
                            <p className="font-semibold text-slate-800 text-sm">Theme Preference</p>
                            <p className="text-xs text-slate-500 mt-0.5">Select your preferred website appearance.</p>
                        </div>
                        <select className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-neutral-900">
                            <option>System Default</option>
                            <option>Light Mode</option>
                            <option>Dark Mode</option>
                        </select>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-8">
                    <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Trash2 size={16} /> Danger Zone
                    </h3>
                    <div className="p-5 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between">
                        <div className="text-left">
                            <p className="font-semibold text-red-800 text-sm">Delete Account</p>
                            <p className="text-xs text-red-600/80 mt-0.5">Permanently delete your account and all data.</p>
                        </div>
                        <button className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors shadow-sm">
                            Delete Account
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
