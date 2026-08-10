'use client'
import { StarIcon, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '@/lib/features/wishlist/wishlistSlice'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const dispatch = useDispatch()
    const wishlistItems = useSelector(state => state.wishlist.items)
    const isWishlisted = wishlistItems.some(item => item.id === product.id)

    // calculate the average rating of the product
    const rating = Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length);

    const toggleWishlist = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isWishlisted) {
            dispatch(removeFromWishlist({ productId: product.id }))
            toast.success("Removed from Wishlist")
        } else {
            dispatch(addToWishlist({ product }))
            toast.success("Added to Wishlist")
        }
    }

    return (
        <Link href={`/product/${product.id}`} className='group max-xl:mx-auto flex flex-col'>
            <div className='bg-neutral-50 border border-neutral-100 group-hover:border-neutral-300 transition-colors h-40 sm:w-60 sm:h-68 rounded-sm flex items-center justify-center overflow-hidden relative'>
                <Image width={500} height={500} className='max-h-30 sm:max-h-40 w-auto group-hover:scale-105 transition-transform duration-500 ease-out mix-blend-multiply' src={product.images[0]} alt="" />
                
                <button 
                    onClick={toggleWishlist}
                    className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm border border-neutral-100 hover:scale-110 active:scale-95 transition-all z-10"
                >
                    <Heart size={16} className={`${isWishlisted ? 'text-neutral-900' : 'text-neutral-400'} transition-colors`} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
            </div>
            <div className='flex justify-between gap-3 text-sm pt-3 max-w-60'>
                <div className='flex-1 truncate'>
                    <p className='font-medium text-neutral-900 truncate'>{product.name}</p>
                    <div className='flex mt-1'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent' fill={rating >= index + 1 ? "#171717" : "#e5e5e5"} />
                        ))}
                    </div>
                </div>
                <p className='font-semibold text-neutral-900'>{currency}{product.price}</p>
            </div>
        </Link>
    )
}

export default ProductCard