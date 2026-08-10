'use client'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Heart, Trash2, ShoppingCart, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { removeFromWishlist } from '@/lib/features/wishlist/wishlistSlice'
import { addToCart } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'

export default function WishlistPage() {
    const wishlistItems = useSelector(state => state.wishlist.items)
    const dispatch = useDispatch()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const handleRemove = (productId, e) => {
        if(e) {
            e.preventDefault()
            e.stopPropagation()
        }
        dispatch(removeFromWishlist({ productId }))
        toast.success("Removed from Wishlist")
    }

    const handleMoveToCart = (product, e) => {
        if(e) {
            e.preventDefault()
            e.stopPropagation()
        }
        dispatch(addToCart({ productId: product.id }))
        dispatch(removeFromWishlist({ productId: product.id }))
        toast.success("Moved to Cart")
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[500px]">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Heart size={22} className="text-neutral-900" fill="currentColor" /> My Wishlist
                </h2>
                <div className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
                </div>
            </div>
            
            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {wishlistItems.map(product => (
                        <div key={product.id} className="group flex flex-col bg-slate-50 border border-slate-100 rounded-xl overflow-hidden hover:border-slate-300 transition-all hover:shadow-md relative">
                            
                            <button 
                                onClick={(e) => handleRemove(product.id, e)}
                                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all z-10 opacity-0 group-hover:opacity-100"
                                title="Remove from Wishlist"
                            >
                                <Trash2 size={16} />
                            </button>

                            <Link href={`/product/${product.id}`} className="block h-48 relative bg-white p-4">
                                <Image src={product.images[0]} alt={product.name} fill className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                            </Link>
                            
                            <div className="p-4 flex flex-col flex-1">
                                <Link href={`/product/${product.id}`}>
                                    <p className="font-semibold text-slate-800 text-sm mb-1 truncate hover:text-neutral-900 transition-colors">{product.name}</p>
                                </Link>
                                <div className="flex items-center gap-2 mb-4">
                                    <p className="font-bold text-neutral-900">{currency}{product.price}</p>
                                    <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">In Stock</p>
                                </div>
                                
                                <div className="mt-auto pt-4 flex gap-2 border-t border-slate-200/60">
                                    <button 
                                        onClick={(e) => handleMoveToCart(product, e)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
                                    >
                                        <ShoppingCart size={16} /> Move to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Heart size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">Your wishlist is empty</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                        Explore our store and add items you love to your wishlist. They will be saved here for later.
                    </p>
                    <Link href="/shop" className="bg-neutral-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2">
                        <Search size={16} /> Browse Products
                    </Link>
                </div>
            )}
        </div>
    )
}
