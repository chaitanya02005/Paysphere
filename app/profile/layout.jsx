'use client'
import React, { useEffect } from 'react'
import { LayoutDashboard, User, Package, Heart, ShoppingCart, MapPin, CreditCard, Bell, Settings, LogOut, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { auth } from '@/lib/firebase'
import toast from 'react-hot-toast'
import { logout } from '@/lib/features/auth/authSlice'

const SidebarItem = ({ icon: Icon, label, href, active }) => (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-neutral-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
        <Icon size={18} />
        <span className="text-sm font-medium">{label}</span>
    </Link>
)

export default function ProfileLayout({ children }) {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [user])

    const handleLogout = async () => {
        try {
            await auth.signOut();
            dispatch(logout());
            router.push('/');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Error logging out');
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                
                {/* Sidebar */}
                <div className="w-full lg:w-72 shrink-0">
                    <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium text-sm">
                        <ArrowLeft size={16} /> Back to Shop
                    </button>
                    
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sticky top-24 overflow-y-auto hide-scrollbar max-h-[85vh]">
                        <div className="flex flex-col gap-1 mb-6">
                            <h2 className="text-lg font-bold text-slate-800 px-2 pb-2">My Account</h2>
                            <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/profile" active={pathname === '/profile'} />
                            <SidebarItem icon={User} label="Personal Information" href="/profile/personal-info" active={pathname === '/profile/personal-info'} />
                            <SidebarItem icon={Package} label="My Orders" href="/orders" active={pathname === '/orders'} />
                            <SidebarItem icon={Heart} label="Wishlist" href="/profile/wishlist" active={pathname === '/profile/wishlist'} />
                            <SidebarItem icon={ShoppingCart} label="Cart" href="/cart" active={pathname === '/cart'} />
                        </div>
                        
                        <div className="flex flex-col gap-1 mb-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-2">Settings</h3>
                            <SidebarItem icon={MapPin} label="Saved Addresses" href="/profile/addresses" active={pathname === '/profile/addresses'} />
                            <SidebarItem icon={CreditCard} label="Payment Methods" href="/profile/payment" active={pathname === '/profile/payment'} />
                            <SidebarItem icon={Bell} label="Notifications" href="/profile/notifications" active={pathname === '/profile/notifications'} />
                            <SidebarItem icon={Settings} label="Account Settings" href="/profile/settings" active={pathname === '/profile/settings'} />
                        </div>
                        
                        <div className="flex flex-col gap-1 border-t border-slate-100 pt-4">
                            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-500 hover:bg-red-50 hover:text-red-600 w-full text-left">
                                <LogOut size={18} />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    {children}
                </div>

            </div>
        </div>
    )
}
