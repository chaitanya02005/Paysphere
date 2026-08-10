'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Package, Heart, ShoppingCart, MapPin, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
const StatCard = ({ icon: Icon, title, value, href }) => (
    <Link href={href} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-neutral-300 transition-colors">
        <div className="flex items-center gap-4">
            <div className="size-12 bg-slate-50 rounded-full flex items-center justify-center text-neutral-900 group-hover:scale-110 transition-transform">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 mb-0.5">{title}</p>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
        <ChevronRight size={20} className="text-slate-300 group-hover:text-neutral-900 transition-colors" />
    </Link>
)

export default function ProfileDashboard() {
    const user = useSelector(state => state.auth.user)
    const wishlistItems = useSelector(state => state.wishlist.items)
    const cartItems = useSelector(state => state.cart.cartItems)
    const products = useSelector(state => state.product.list)
    const [profileData, setProfileData] = useState(null)
    const [recentOrders, setRecentOrders] = useState([])

    const cartCount = Object.values(cartItems).reduce((acc, curr) => acc + curr, 0)

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.uid) {
                try {
                    const res = await fetch(`/api/profile?uid=${user.uid}`)
                    const data = await res.json()
                    if (data.success) {
                        setProfileData(data.user)
                    }
                    
                    const ordersRes = await fetch(`/api/orders/user?uid=${user.uid}`)
                    const ordersData = await ordersRes.json()
                    if (ordersData.success) {
                        setRecentOrders(ordersData.orders.slice(0, 3)) // Get last 3 orders
                    }
                } catch (error) {
                    console.error("Failed to fetch dashboard data:", error)
                }
            }
        }
        fetchProfile()
    }, [user])

    const initial = user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()
    
    // Mock recently viewed
    const recentlyViewed = products.slice(0, 4)

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header Banner */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-neutral-800 to-neutral-900 relative">
                    <div className="absolute -bottom-10 left-8">
                        <div className="size-20 bg-white rounded-full p-1 shadow-md flex items-center justify-center">
                            <div className="size-full bg-neutral-900 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                {initial}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-14 pb-6 px-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-1">{user?.name || "Verified User"}</h1>
                        <p className="text-slate-500 text-sm">{user?.email}</p>
                    </div>
                    <Link href="/profile/personal-info" className="text-sm font-medium text-neutral-900 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                        Edit Profile
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Package} title="Total Orders" value={recentOrders.length || 0} href="/orders" />
                <StatCard icon={Heart} title="Wishlist Items" value={wishlistItems.length} href="/profile/wishlist" />
                <StatCard icon={ShoppingCart} title="Cart Items" value={cartCount} href="/cart" />
                <StatCard icon={MapPin} title="Saved Addresses" value={profileData?.addresses?.length || 0} href="/profile/addresses" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Clock size={18} className="text-neutral-900" /> Recent Orders
                        </h2>
                        <Link href="/orders" className="text-sm font-medium text-slate-500 hover:text-neutral-900 transition-colors">View All</Link>
                    </div>
                    
                    {recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recentOrders.map(order => (
                                <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 bg-slate-50 rounded-lg flex items-center justify-center font-bold text-slate-400 text-xs uppercase">
                                            #{order.id.slice(-4)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{new Date(order.created_at).toLocaleDateString()}</p>
                                            <p className="text-xs text-slate-500">{order.items?.length || 0} items • {order.status}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-neutral-900">${order.total}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-500 text-sm">
                            No recent orders found.
                        </div>
                    )}
                </div>

                {/* Recently Viewed */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Recently Viewed</h2>
                    <div className="space-y-4">
                        {recentlyViewed.map(product => (
                            <Link href={`/product/${product.id}`} key={product.id} className="flex items-center gap-4 group">
                                <div className="size-14 rounded-lg bg-slate-50 border border-slate-100 p-2 overflow-hidden relative shrink-0">
                                    <Image src={product.images[0]} alt={product.name} fill className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-800 text-sm truncate group-hover:text-neutral-900 transition-colors">{product.name}</p>
                                    <p className="text-xs font-semibold text-neutral-500">${product.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}
