'use client'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { login, logout } from '@/lib/features/auth/authSlice';

export default function AuthProvider({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.emailVerified) {
                dispatch(login({ uid: user.uid, name: user.displayName, email: user.email }));
            } else {
                dispatch(logout());
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return <>{children}</>;
}
