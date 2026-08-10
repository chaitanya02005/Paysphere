'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { assets } from '@/assets/assets'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import toast from 'react-hot-toast'

const LoginPage = () => {
    const router = useRouter()
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [verificationEmail, setVerificationEmail] = useState('')

    const handleAuth = async (e) => {
        e.preventDefault()
        try {
            if (isSignUp) {
                if (password !== confirmPassword) {
                    toast.error("Passwords do not match")
                    return
                }
                
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                await updateProfile(userCredential.user, { displayName: name })
                
                // Save data to MySQL backend
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        uid: userCredential.user.uid,
                        name: name,
                        email: email,
                        phone: phone,
                        password: password
                    })
                })

                if (!response.ok) {
                    console.error("Failed to sync user to MySQL")
                }

                await sendEmailVerification(userCredential.user)
                await signOut(auth) // Sign out immediately so they aren't auto-logged in
                setVerificationEmail(email)
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password)
                if (!userCredential.user.emailVerified) {
                    await signOut(auth) // Block access
                    setVerificationEmail(email)
                } else {
                    router.push('/')
                }
            }
        } catch (error) {
            if (isSignUp) {
                if (error.code === 'auth/email-already-in-use') {
                    toast.error("User already exists. Please sign in")
                } else {
                    toast.error(error.message)
                }
            } else {
                toast.error("Email or password is incorrect")
            }
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const userCredential = await signInWithPopup(auth, provider)
            
            // Sync user to MySQL backend
            await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: userCredential.user.uid,
                    name: userCredential.user.displayName || 'Google User',
                    email: userCredential.user.email,
                    phone: userCredential.user.phoneNumber || '',
                    password: 'google-oauth-dummy-password'
                })
            }).catch(err => console.error("Error syncing Google user:", err))

            if (!userCredential.user.emailVerified) {
                await signOut(auth)
                setVerificationEmail(userCredential.user.email)
            } else {
                router.push('/')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    if (verificationEmail) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
                <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-10 sm:p-14 w-full max-w-[500px] text-center">
                    <h1 className="text-3xl font-bold text-slate-800 mb-6">Verify your email</h1>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        We have sent you a verification email to <strong>{verificationEmail}</strong>. Please verify it and log in.
                    </p>
                    <button 
                        onClick={() => { setVerificationEmail(''); setIsSignUp(false); setEmail(''); setPassword(''); setName(''); setPhone(''); setConfirmPassword(''); }} 
                        className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-10 py-3 rounded-full transition-colors text-sm shadow-md shadow-neutral-900/20"
                    >
                        Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full flex">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50 relative">
                
                <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-10 sm:p-14 w-full max-w-[500px]">
                    <div className="mb-14">
                        <Link href="/" className="relative text-3xl font-bold text-slate-700">
                            <span className="text-neutral-800">Pay</span>Sphere<span className="text-neutral-800 text-4xl leading-0">.</span>
                        </Link>
                    </div>

                    <p className="text-sm text-slate-400 mb-2 font-medium">{isSignUp ? "Create a new account" : "Welcome back !!!"}</p>
                    <h1 className="text-4xl font-bold text-slate-800 mb-10">{isSignUp ? "Sign up" : "Sign in"}</h1>

                    <form className="space-y-6" onSubmit={handleAuth}>
                        {isSignUp && (
                            <>
                                <div>
                                    <label className="block text-sm text-slate-600 mb-2 ml-2 font-medium">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full bg-slate-50 border-none text-slate-700 rounded-lg px-5 py-3.5 outline-none focus:ring-2 focus:ring-neutral-900/30 transition-all text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 mb-2 ml-2 font-medium">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1 234 567 8900"
                                        className="w-full bg-slate-50 border-none text-slate-700 rounded-lg px-5 py-3.5 outline-none focus:ring-2 focus:ring-neutral-900/30 transition-all text-sm"
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm text-slate-600 mb-2 ml-2 font-medium">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="test@gmail.com"
                                className="w-full bg-slate-50 border-none text-slate-700 rounded-lg px-5 py-3.5 outline-none focus:ring-2 focus:ring-neutral-900/30 transition-all text-sm"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2 px-2">
                                <label className="text-sm text-slate-600 font-medium">Password</label>
                                {!isSignUp && <Link href="/forgot-password" className="text-xs text-slate-400 hover:text-neutral-800 transition-colors">Forgot Password ?</Link>}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-slate-50 border-none text-slate-700 rounded-lg px-5 py-3.5 outline-none focus:ring-2 focus:ring-neutral-900/30 transition-all text-sm tracking-widest"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {isSignUp && (
                            <div>
                                <label className="block text-sm text-slate-600 mb-2 ml-2 font-medium">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-slate-50 border-none text-slate-700 rounded-lg px-5 py-3.5 outline-none focus:ring-2 focus:ring-neutral-900/30 transition-all text-sm tracking-widest"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 flex flex-col items-center gap-6">
                            <button type="submit" className="flex items-center justify-center gap-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-10 py-3 rounded-full transition-colors text-sm shadow-md shadow-neutral-900/20 w-full">
                                {isSignUp ? "SIGN UP" : "SIGN IN"} <ArrowRight size={16} />
                            </button>

                            <div className="flex items-center gap-4 w-full my-2">
                                <div className="h-[1px] flex-1 bg-slate-200"></div>
                                <span className="text-xs text-slate-400 font-medium uppercase">Or</span>
                                <div className="h-[1px] flex-1 bg-slate-200"></div>
                            </div>

                            <button type="button" onClick={handleGoogleSignIn} className="flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-10 py-3 rounded-full transition-colors text-sm shadow-sm w-full">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </button>
                            
                            <p className="text-sm text-slate-400 mt-2">
                                {isSignUp ? "Already have an account ?" : "I don't have an account ?"} <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-neutral-900 hover:text-neutral-800 font-medium">{isSignUp ? "Sign in" : "Sign up"}</button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Column (Light Green) - Illustration */}
            <div className="hidden lg:flex w-1/2 bg-[#eaf6f0] items-center justify-center p-12 relative overflow-hidden">
                <Image src={assets.login_illustration} alt="Login Illustration" className="max-w-2xl w-full object-contain mix-blend-multiply relative z-10 scale-110" />
            </div>
        </div>
    )
}

export default LoginPage
