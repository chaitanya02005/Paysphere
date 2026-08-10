'use client'

import { Star } from 'lucide-react';
import React, { useState } from 'react'
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const RatingModal = ({ ratingModal, setRatingModal }) => {

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (review.length < 5) {
            toast.error('Write a short review');
            return;
        }

        const toastId = toast.loading('Submitting...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success('Thank you for your rating!', { id: toastId });
        setRatingModal(null);
    }

    return (
        <div className='fixed inset-0 z-120 flex items-center justify-center bg-black/10'>
            <div className='bg-white p-8 rounded-lg shadow-lg w-96 relative'>
                <button onClick={() => setRatingModal(null)} className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'>
                    <XIcon size={20} />
                </button>
                <h2 className='text-xl font-medium text-slate-600 mb-4'>Rate Product</h2>
                <div className='flex items-center justify-center mb-4'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-8 cursor-pointer ${rating > i ? "text-green-400 fill-current" : "text-gray-300"}`}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <textarea
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-400'
                    placeholder='Write your review (optional)'
                    rows='4'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <button onClick={handleSubmit} className='w-full bg-neutral-900 text-white py-2 rounded-md hover:bg-neutral-800 transition'>
                    Submit Rating
                </button>
            </div>
        </div>
    )
}

export default RatingModal