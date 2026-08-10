import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: []
    },
    reducers: {
        addToWishlist: (state, action) => {
            const { product } = action.payload
            if (!state.items.find(item => item.id === product.id)) {
                state.items.push(product)
            }
        },
        removeFromWishlist: (state, action) => {
            const { productId } = action.payload
            state.items = state.items.filter(item => item.id !== productId)
        },
        clearWishlist: (state) => {
            state.items = []
        },
        setWishlist: (state, action) => {
            state.items = action.payload.items || []
        }
    }
})

export const { addToWishlist, removeFromWishlist, clearWishlist, setWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
