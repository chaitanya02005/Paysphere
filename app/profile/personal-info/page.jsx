'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { User, Mail, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PersonalInfoPage() {
    const user = useSelector(state => state.auth.user)
    const [profileData, setProfileData] = useState(null)
    const [isEditingPhone, setIsEditingPhone] = useState(false)
    const [editPhoneValue, setEditPhoneValue] = useState('')
    const [isEditingName, setIsEditingName] = useState(false)
    const [editNameValue, setEditNameValue] = useState('')

    const fetchProfile = async () => {
        if (user?.uid) {
            try {
                const res = await fetch(`/api/profile?uid=${user.uid}`)
                const data = await res.json()
                if (data.success) {
                    setProfileData(data.user)
                    setEditPhoneValue(data.user.phone_number || '')
                    setEditNameValue(data.user.name || user.name || '')
                }
            } catch (error) {
                console.error("Failed to fetch profile data:", error)
            }
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [user])

    const handleSaveField = async (field, value, setter) => {
        try {
            const res = await fetch('/api/profile/edit', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: user.uid, [field]: value })
            })
            if (res.ok) {
                toast.success(`${field.replace('_', ' ')} updated!`)
                setter(false)
                fetchProfile()
            } else {
                toast.error(`Failed to update ${field}`)
            }
        } catch (error) {
            toast.error("Error updating profile")
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <User size={22} className="text-neutral-900" /> Personal Information
            </h2>
            
            <div className="max-w-2xl space-y-6">
                <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-6">
                    {/* Name */}
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-400 font-medium mb-1">Full Name</p>
                            {!isEditingName && (
                                <button onClick={() => setIsEditingName(true)} className="text-neutral-900 hover:text-neutral-700">
                                    <Edit2 size={14} />
                                </button>
                            )}
                        </div>
                        {isEditingName ? (
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={editNameValue} 
                                    onChange={e => setEditNameValue(e.target.value)}
                                    className="flex-1 text-sm bg-white border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-neutral-900"
                                />
                                <button onClick={() => handleSaveField('name', editNameValue, setIsEditingName)} className="text-xs font-medium bg-neutral-900 text-white px-4 rounded hover:bg-neutral-800 transition">Save</button>
                                <button onClick={() => setIsEditingName(false)} className="text-xs font-medium text-slate-500 px-2">Cancel</button>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-800 font-medium">{profileData?.name || user?.name || "Not provided"}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">Email Address <Mail size={12}/></p>
                        <p className="text-sm text-slate-800 font-medium">{profileData?.email || user?.email}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Email cannot be changed.</p>
                    </div>

                    {/* Phone */}
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-400 font-medium mb-1">Phone Number</p>
                            {!isEditingPhone && (
                                <button onClick={() => setIsEditingPhone(true)} className="text-neutral-900 hover:text-neutral-700">
                                    <Edit2 size={14} />
                                </button>
                            )}
                        </div>
                        {isEditingPhone ? (
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={editPhoneValue} 
                                    onChange={e => setEditPhoneValue(e.target.value)}
                                    className="flex-1 text-sm bg-white border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-neutral-900"
                                />
                                <button onClick={() => handleSaveField('phone_number', editPhoneValue, setIsEditingPhone)} className="text-xs font-medium bg-neutral-900 text-white px-4 rounded hover:bg-neutral-800 transition">Save</button>
                                <button onClick={() => setIsEditingPhone(false)} className="text-xs font-medium text-slate-500 px-2">Cancel</button>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-800 font-medium">{profileData?.phone_number || "Not provided"}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
