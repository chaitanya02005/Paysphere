'use client'
import React, { useState } from 'react'
import Title from './Title'
import toast from 'react-hot-toast'

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Subscribing...");

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Subscribed successfully! Check your inbox.", { id: loadingToast });
                setEmail('');
            } else {
                toast.error(data.error || "Subscription failed. Please try again.", { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center mx-4 my-36'>
            <Title title="Join Newsletter" description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week." visibleButton={false} />
            <form onSubmit={handleSubscribe} className='flex bg-slate-100 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-white ring ring-slate-200'>
                <input 
                    className='flex-1 pl-5 outline-none bg-transparent' 
                    type="email" 
                    placeholder='Enter your email address' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                <button 
                    disabled={loading}
                    type="submit" 
                    className='font-medium bg-neutral-900 text-white px-7 py-3 rounded-full hover:scale-103 active:scale-95 transition disabled:bg-neutral-500 disabled:cursor-not-allowed'>
                    {loading ? 'Subscribing...' : 'Get Updates'}
                </button>
            </form>
        </div>
    )
}

export default Newsletter