'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import OrderSummary from '@/components/OrderSummary'
import PageTitle from '@/components/PageTitle'

export default function CheckoutPage() {
    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const router = useRouter();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        let tempPrice = 0;
        const tempArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                tempArray.push({
                    ...product,
                    quantity: value,
                });
                tempPrice += product.price * value;
            }
        }
        setCartArray(tempArray);
        setTotalPrice(tempPrice);
    }, [cartItems, products, isLoggedIn, router]);

    return (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto">
                <PageTitle heading="Checkout" text="complete your purchase" />
                
                {cartArray.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-10 justify-center">
                        <div className="flex-1 max-w-2xl">
                            <h2 className="text-2xl font-semibold mb-6">Review Items</h2>
                            <div className="space-y-4">
                                {cartArray.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-contain bg-white rounded-md p-2 border border-slate-200" />
                                            <div>
                                                <p className="font-medium text-slate-700">{item.name}</p>
                                                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="font-medium">
                                            ${(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="w-full max-w-sm">
                            <OrderSummary totalPrice={totalPrice} items={cartArray} isCartPage={false} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <h2 className="text-2xl font-semibold mb-4">No items to checkout</h2>
                        <button onClick={() => router.push('/shop')} className="bg-neutral-900 text-white px-6 py-2 rounded-full hover:bg-neutral-800 transition">Go to Shop</button>
                    </div>
                )}
            </div>
        </div>
    )
}
