'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { MapPin, Plus, Edit2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { setAddresses } from '@/lib/features/address/addressSlice'

export default function AddressesPage() {
    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch()
    const [addresses, setLocalAddresses] = useState([])
    
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState({ id: '', name: '', street: '', city: '', state: '', zip: '', country: '', phone: '' })

    const fetchProfile = async () => {
        if (user?.uid) {
            try {
                const res = await fetch(`/api/profile?uid=${user.uid}`)
                const data = await res.json()
                if (data.success) {
                    setLocalAddresses(data.user.addresses || [])
                    dispatch(setAddresses(data.user.addresses || []))
                }
            } catch (error) {
                console.error("Failed to fetch addresses:", error)
            }
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [user])

    const openAdd = () => {
        setForm({ id: '', name: '', street: '', city: '', state: '', zip: '', country: '', phone: '' })
        setIsEditing(false)
        setShowModal(true)
    }

    const openEdit = (addr) => {
        setForm({ ...addr })
        setIsEditing(true)
        setShowModal(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        try {
            const payload = { 
                ...form, 
                user_id: user.uid,
                id: isEditing ? form.id : 'addr_' + Date.now() 
            }
            const res = await fetch('/api/addresses', {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (res.ok) {
                toast.success(isEditing ? "Address updated!" : "Address added!")
                setShowModal(false)
                fetchProfile()
            } else {
                toast.error("Failed to save address")
            }
        } catch (error) {
            toast.error("Error saving address")
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <MapPin size={22} className="text-neutral-900" /> Saved Addresses
                </h2>
                <button onClick={openAdd} className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm">
                    <Plus size={16} /> Add New Address
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length > 0 ? (
                    addresses.map(addr => (
                        <div key={addr.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow relative group">
                            <button onClick={() => openEdit(addr)} className="absolute top-4 right-4 text-slate-300 hover:text-neutral-900 transition-colors opacity-0 group-hover:opacity-100">
                                <Edit2 size={16} />
                            </button>
                            <p className="font-semibold text-slate-800 text-sm mb-2">{addr.name}</p>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                {addr.street}<br/>
                                {addr.city}, {addr.state} {addr.zip}<br/>
                                {addr.country}
                            </p>
                            {addr.phone && <p className="text-xs font-medium text-slate-500 flex items-center gap-1">📞 {addr.phone}</p>}
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-16 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                        <MapPin size={32} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500 font-medium">No saved addresses found.</p>
                        <p className="text-sm text-slate-400 mt-1">Add an address to speed up your checkout process.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800">{isEditing ? 'Edit Address' : 'Add New Address'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Street Address</label>
                                    <input required value={form.street} onChange={e => setForm({...form, street: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">City</label>
                                    <input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">State / Province</label>
                                    <input required value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">ZIP / Postal Code</label>
                                    <input required value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Country</label>
                                    <input required value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Phone Number (Optional)</label>
                                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors" />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm shadow-neutral-900/20 transition-colors">Save Address</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
