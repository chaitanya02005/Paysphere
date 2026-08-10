'use client'
import { categories } from "@/assets/assets";
import { useRouter } from "next/navigation";

const CategoriesMarquee = () => {
    const router = useRouter();

    return (
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group sm:my-20">
            <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
            <div className="flex min-w-[200%] animate-[marqueeScroll_10s_linear_infinite] sm:animate-[marqueeScroll_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-4" >
                {[...categories, ...categories, ...categories, ...categories].map((company, index) => (
                    <button onClick={() => router.push('/shop?search=' + company)} key={index} className="px-6 py-2 bg-transparent border border-neutral-200 rounded-full text-neutral-500 text-xs tracking-wider uppercase font-medium hover:border-neutral-900 hover:text-neutral-900 hover:bg-neutral-50 active:scale-95 transition-all duration-300">
                        {company}
                    </button>
                ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>
    );
};

export default CategoriesMarquee;