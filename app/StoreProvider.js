'use client'
import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../lib/store'
import AuthProvider from '@/components/AuthProvider'
import { setCart } from '@/lib/features/cart/cartSlice'
import { setWishlist } from '@/lib/features/wishlist/wishlistSlice'
import { setProduct } from '@/lib/features/product/productSlice'

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

    useEffect(() => {
        try {
            const cartState = localStorage.getItem('cartState');
            if (cartState) storeRef.current.dispatch(setCart(JSON.parse(cartState)));

            const wishlistState = localStorage.getItem('wishlistState');
            if (wishlistState) storeRef.current.dispatch(setWishlist(JSON.parse(wishlistState)));
        } catch (e) {
            console.error('Could not load states from local storage', e);
        }

        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    storeRef.current.dispatch(setProduct(data.products));
                }
            })
            .catch(e => console.error('Failed to fetch products', e));
        
        const unsubscribe = storeRef.current.subscribe(() => {
            const state = storeRef.current.getState();
            localStorage.setItem('cartState', JSON.stringify(state.cart));
            localStorage.setItem('wishlistState', JSON.stringify(state.wishlist));
        });
    
    return () => unsubscribe();
  }, []);

  return <Provider store={storeRef.current}><AuthProvider>{children}</AuthProvider></Provider>
}