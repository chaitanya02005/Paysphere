'use client'
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { useSelector } from "react-redux";

export default function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.uid) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/orders/user?uid=${user.uid}`);
                const data = await res.json();
                if (res.ok && data.success) {
                    setOrders(data.orders);
                } else {
                    console.error("Failed to fetch orders:", data.error);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrders();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-[70vh] mx-6 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 text-sm">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] mx-6">
            {orders.length > 0 ? (
                (
                    <div className="my-20 max-w-7xl mx-auto">
                        <PageTitle heading="My Orders" text={`Showing total ${orders.length} orders`} linkText={'Go to home'} />

                        <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                            <thead>
                                <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                    <th className="text-left">Product</th>
                                    <th className="text-center">Total Price</th>
                                    <th className="text-left">Address</th>
                                    <th className="text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <OrderItem order={order} key={order.id} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">You have no orders</h1>
                </div>
            )}
        </div>
    )
}