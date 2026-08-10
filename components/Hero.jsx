'use client'
import { assets } from '@/assets/assets'
import premiumModel from '@/assets/premium_model.png'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    return (
        <div className='mx-6'>
            <div className='flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto my-16'>
                {/* Left Column: Typography */}
                <div className='flex-1 flex flex-col justify-center py-10 lg:pr-10'>
                    <div className='inline-flex items-center gap-3 bg-white border border-neutral-200 text-neutral-600 pr-4 p-1 rounded-sm text-xs sm:text-sm font-medium w-fit mb-8'>
                        <span className='bg-neutral-900 px-3 py-1 rounded-sm text-white text-xs tracking-wider uppercase'>News</span> Free Shipping on Orders Above {currency}50 <ChevronRightIcon className='group-hover:ml-1 transition-all' size={16} />
                    </div>
                    <h2 className='text-5xl sm:text-7xl leading-[1.05] mb-8 font-extrabold text-neutral-900 tracking-tighter'>
                        Premium tech for the modern professional.
                    </h2>
                    <div className='text-neutral-500 text-sm mb-10'>
                        <p className='uppercase tracking-widest text-[10px] font-bold mb-1 text-neutral-400'>Starting collection at</p>
                        <p className='text-4xl font-light text-neutral-900'>{currency}1499</p>
                    </div>
                    <Link href="/shop" className='inline-block w-fit bg-neutral-900 text-white text-sm font-medium py-4 px-12 rounded-sm hover:bg-neutral-800 transition-colors shadow-sm tracking-wide'>EXPLORE CATALOG</Link>
                </div>

                {/* Right Column: Editorial Collage */}
                <div className='flex-[1.2] relative min-h-[500px] lg:min-h-[600px] w-full mt-10 lg:mt-0'>
                    {/* Main Portrait Image */}
                    <div className='absolute top-0 right-0 w-[60%] sm:w-[50%] h-[90%] bg-neutral-100 border border-neutral-200 rounded-sm overflow-hidden z-10 flex items-end justify-center'>
                        <Image className='w-full object-cover grayscale opacity-95' src={premiumModel} alt="Premium model" />
                    </div>
                    
                    {/* Secondary Landscape Box */}
                    <div className='absolute bottom-0 left-0 w-[65%] sm:w-[55%] bg-white border border-neutral-200 rounded-sm p-6 shadow-xl z-20 hover:border-neutral-300 transition-colors group flex flex-col justify-between'>
                        <div>
                            <p className='text-xl font-bold text-neutral-900 leading-snug'>Curated Essentials</p>
                            <Link href="/shop" className='inline-flex items-center gap-1 mt-3 text-neutral-500 hover:text-neutral-900 transition-colors font-medium text-xs uppercase tracking-wider'>View collection <ArrowRightIcon className='group-hover:translate-x-1 transition-transform' size={14} /> </Link>
                        </div>
                        <Image className='w-full max-h-32 object-contain mt-6 mix-blend-multiply' src={assets.product_img13} alt="Product" />
                    </div>

                    {/* Tertiary Accent Box */}
                    <div className='absolute top-[5%] left-[5%] sm:left-[15%] w-[45%] sm:w-[35%] bg-neutral-900 border border-neutral-800 rounded-sm p-5 shadow-2xl z-30 group'>
                        <Image className='w-full max-h-24 object-contain mb-4 drop-shadow-lg' src={assets.product_img18} alt="Product" />
                        <p className='text-sm font-semibold text-white leading-snug'>Exclusive Deals</p>
                        <Link href="/shop" className='inline-flex items-center gap-1 mt-2 text-neutral-400 hover:text-white transition-colors font-medium text-[10px] uppercase tracking-wider'>Discover <ArrowRightIcon className='group-hover:translate-x-1 transition-transform' size={12} /> </Link>
                    </div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>

    )
}

export default Hero