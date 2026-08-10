'use client'
import { Search, ShoppingCart, User, Package, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Navbar = () => {

    const router = useRouter();

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => Object.keys(state.cart.cartItems).length)
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
    const user = useSelector(state => state.auth.user)
    const authLoading = useSelector(state => state.auth.authLoading)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    return (
        <nav className="relative bg-white border-b border-neutral-100 z-50">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-5 transition-all">

                    <Link href="/" className="relative text-2xl font-bold tracking-tight text-neutral-900">
                        PaySphere<span className="text-neutral-400 text-3xl leading-0">.</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-6 lg:gap-10 text-sm font-medium text-neutral-500">
                        <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
                        <Link href="/shop" className="hover:text-neutral-900 transition-colors">Shop</Link>
                        <Link href="/about" className="hover:text-neutral-900 transition-colors">About</Link>
                        <Link href="/contact" className="hover:text-neutral-900 transition-colors">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-72 text-sm gap-3 border border-neutral-200 px-4 py-2.5 rounded-sm focus-within:border-neutral-900 transition-colors group">
                            <Search size={16} className="text-neutral-400 group-focus-within:text-neutral-900" strokeWidth={1.5} />
                            <input className="w-full bg-transparent outline-none placeholder-neutral-400 text-neutral-900" type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                            <ShoppingCart size={18} strokeWidth={1.5} />
                            Cart
                            <span className="absolute -top-1.5 -right-3 text-[10px] text-white bg-neutral-900 size-4 flex items-center justify-center rounded-full font-medium">{cartCount}</span>
                        </Link>

                        {authLoading ? (
                            <div className="w-20 h-10 bg-neutral-100 rounded-sm animate-pulse"></div>
                        ) : isLoggedIn ? (
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                                    className="flex items-center justify-center size-9 bg-neutral-900 hover:bg-neutral-800 transition-colors text-white rounded-full font-semibold text-sm shadow-sm"
                                >
                                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-12 w-56 bg-white shadow-xl shadow-neutral-200/50 py-2 border border-neutral-100 rounded-sm z-50">
                                        <div className="px-4 py-3 border-b border-neutral-100 mb-1">
                                            <p className="text-sm font-medium text-neutral-900 truncate">{user?.name || "User"}</p>
                                            <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                                        </div>
                                        
                                        <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                                            <User size={16} strokeWidth={1.5} /> My Profile
                                        </Link>
                                        <Link href="/orders" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                                            <Package size={16} strokeWidth={1.5} /> My Orders
                                        </Link>
                                        <Link href="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                                            <Settings size={16} strokeWidth={1.5} /> Settings
                                        </Link>
                                        
                                        <div className="h-[1px] bg-neutral-100 my-1"></div>
                                        
                                        <button onClick={() => { signOut(auth); setIsDropdownOpen(false); router.push('/login'); }} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                            <LogOut size={16} strokeWidth={1.5} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 transition-colors text-white text-sm font-medium rounded-sm">
                                Sign In
                            </Link>
                        )}

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden flex items-center gap-4">
                        <Link href="/cart" className="relative flex items-center gap-2 text-neutral-600">
                            <ShoppingCart size={18} strokeWidth={1.5} />
                            <span className="absolute -top-1.5 -right-2 text-[10px] text-white bg-neutral-900 size-4 flex items-center justify-center rounded-full">{cartCount}</span>
                        </Link>
                        {authLoading ? (
                            <div className="w-[60px] h-[32px] bg-neutral-100 rounded-sm animate-pulse"></div>
                        ) : isLoggedIn ? (
                            <button onClick={() => { signOut(auth); router.push('/login') }} className="flex items-center justify-center size-8 bg-neutral-900 hover:bg-neutral-800 transition text-white rounded-full font-medium text-xs">
                                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                            </button>
                        ) : (
                            <Link href="/login" className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-xs font-medium transition text-white rounded-sm">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar