import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    user: null,
    authLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
            state.authLoading = false;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.authLoading = false;
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
