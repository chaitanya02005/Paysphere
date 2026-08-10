import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import AddressModal from './AddressModal';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { setAddresses } from '@/lib/features/address/addressSlice';
import { deleteItemFromCart } from '@/lib/features/cart/cartSlice';
import Script from 'next/script';

const OrderSummary = ({ totalPrice, items, isCartPage = false }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const router = useRouter();
    const dispatch = useDispatch();

    const addressList = useSelector(state => state.address.list);
    const user = useSelector(state => state.auth.user);

    const fetchAddresses = async () => {
        if (user?.uid) {
            try {
                const res = await fetch(`/api/profile?uid=${user.uid}`);
                const data = await res.json();
                if (data.success && data.user.addresses) {
                    dispatch(setAddresses(data.user.addresses));
                }
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
            }
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [user]);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');

    const handleCouponCode = async (event) => {
        event.preventDefault();
        if (!couponCodeInput) return;
        
        const toastId = toast.loading('Checking Coupon...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (couponCodeInput.toUpperCase() === 'DISCOUNT10') {
            setCoupon({ code: 'DISCOUNT10', discount: 10, description: '10% off' });
            toast.success('Coupon applied!', { id: toastId });
        } else if (couponCodeInput.toUpperCase() === 'SAVE20') {
            setCoupon({ code: 'SAVE20', discount: 20, description: '20% off' });
            toast.success('Coupon applied!', { id: toastId });
        } else {
            toast.error('Invalid coupon code', { id: toastId });
        }
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!selectedAddress) {
            toast.error("Please select an address");
            return;
        }

        const orderData = {
            user_id: user?.uid,
            user_name: user?.name || user?.email?.split('@')[0],
            user_email: user?.email,
            address_id: selectedAddress.id,
            items: items,
            total: coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)) : totalPrice,
            payment_method: paymentMethod,
            coupon_data: coupon || null,
        };

        try {
            const res = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to place order');
            }

            if (paymentMethod === 'RAZORPAY') {
                const options = {
                    key: data.key_id,
                    amount: data.amount,
                    currency: data.currency,
                    name: "PaySphere",
                    description: "Order Payment",
                    order_id: data.razorpay_order_id,
                    handler: async function (response) {
                        try {
                            const verifyRes = await fetch('/api/orders/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    ...response,
                                    order_id: data.order_id,
                                    user_id: user.uid,
                                    user_name: user?.name || user?.email?.split('@')[0],
                                    user_email: user?.email,
                                    amount: orderData.total
                                })
                            });
                            const verifyData = await verifyRes.json();
                            if (verifyRes.ok) {
                                toast.success("Payment successful!");
                                items.forEach(item => {
                                    dispatch(deleteItemFromCart({ productId: item.id }));
                                });
                                router.push('/orders');
                            } else {
                                toast.error("Payment verification failed");
                            }
                        } catch (err) {
                            toast.error("Error verifying payment");
                        }
                    },
                    prefill: {
                        name: user?.name || "",
                        email: user?.email || "",
                        contact: selectedAddress.phone || "",
                    },
                    theme: {
                        color: "#3399cc"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else {
                toast.success("Order placed successfully!");
                items.forEach(item => {
                    dispatch(deleteItemFromCart({ productId: item.id }));
                });
                router.push('/orders');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error placing order");
        }
    }

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <h2 className='text-xl font-medium text-slate-600'>Payment Summary</h2>
            {!isCartPage && (
                <>
                    <p className='text-slate-400 text-xs my-4'>Payment Method</p>
                    <div className='flex gap-4 items-center'>
                        <div className='flex gap-2 items-center'>
                            <input type="radio" id="COD" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} className='accent-gray-500' />
                            <label htmlFor="COD" className='cursor-pointer'>COD</label>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input type="radio" id="RAZORPAY" onChange={() => setPaymentMethod('RAZORPAY')} checked={paymentMethod === 'RAZORPAY'} className='accent-gray-500' />
                            <label htmlFor="RAZORPAY" className='cursor-pointer'>Razorpay</label>
                        </div>
                    </div>
                </>
            )}
            {!isCartPage && (
                <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
                    <p>Address</p>
                    {
                        selectedAddress ? (
                            <div className='flex gap-2 items-center'>
                                <p>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                                <SquarePenIcon onClick={() => setSelectedAddress(null)} className='cursor-pointer' size={18} />
                            </div>
                        ) : (
                            <div>
                                {
                                    addressList.length > 0 && (
                                        <select className='border border-slate-400 p-2 w-full my-3 outline-none rounded' onChange={(e) => setSelectedAddress(addressList[e.target.value])} >
                                            <option value="">Select Address</option>
                                            {
                                                addressList.map((address, index) => (
                                                    <option key={index} value={index}>{address.name}, {address.city}, {address.state}, {address.zip}</option>
                                                ))
                                            }
                                        </select>
                                    )
                                }
                                <button className='flex items-center gap-1 text-slate-600 mt-1' onClick={() => setShowAddressModal(true)} >Add Address <PlusIcon size={18} /></button>
                            </div>
                        )
                    }
                </div>
            )}
            <div className='pb-4 border-b border-slate-200'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 text-slate-400'>
                        <p>Subtotal:</p>
                        <p>Shipping:</p>
                        {coupon && <p>Coupon:</p>}
                    </div>
                    <div className='flex flex-col gap-1 font-medium text-right'>
                        <p>{currency}{totalPrice.toLocaleString()}</p>
                        <p>Free</p>
                        {coupon && <p>{`-${currency}${(coupon.discount / 100 * totalPrice).toFixed(2)}`}</p>}
                    </div>
                </div>
                {
                    !coupon ? (
                        <form onSubmit={handleCouponCode} className='flex justify-center gap-3 mt-3'>
                            <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Coupon Code' className='border border-slate-400 p-1.5 rounded w-full outline-none' />
                            <button className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>Apply</button>
                        </form>
                    ) : (
                        <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
                            <p>Code: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
                            <p>{coupon.description}</p>
                            <XIcon size={18} onClick={() => setCoupon('')} className='hover:text-red-700 transition cursor-pointer' />
                        </div>
                    )
                }
            </div>
            <div className='flex justify-between py-4'>
                <p>Total:</p>
                <p className='font-medium text-right'>{currency}{coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)).toFixed(2) : totalPrice.toLocaleString()}</p>
            </div>
            {isCartPage ? (
                <button onClick={() => router.push('/checkout')} className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all'>Proceed to Checkout</button>
            ) : (
                <button onClick={e => toast.promise(handlePlaceOrder(e), { loading: 'placing Order...' })} className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all'>Place Order</button>
            )}

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}

        </div>
    )
}

export default OrderSummary