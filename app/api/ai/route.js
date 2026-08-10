import { NextResponse } from 'next/server';
import { productDummyData, categories } from '@/assets/assets';

export async function POST(req) {
    try {
        const body = await req.json();
        const { type, payload, context } = body;

        let responseText = "I didn't quite catch that. How can I help you shop today?";
        let action = 'chat';
        let actionData = null;
        let recommendedProducts = null;

        if (type === 'image') {
            responseText = "This looks like a premium tech accessory! I've found a few similar items in our catalog.";
            action = 'navigate';
            actionData = { route: '/shop?search=accessories' };
            recommendedProducts = productDummyData.filter(p => p.category.toLowerCase() === 'accessories').slice(0, 3);
        } else if (type === 'text' || type === 'voice') {
            const query = payload.toLowerCase();

            // Direct Navigation Intents
            if (query.includes('go back')) {
                return NextResponse.json({ success: true, reply: "Going back.", action: 'back' });
            }
            if (query.includes('go home')) {
                return NextResponse.json({ success: true, reply: "Taking you home.", action: 'navigate', data: { route: '/' } });
            }
            if (query.includes('open cart') || query.includes('go to cart')) {
                return NextResponse.json({ success: true, reply: "Opening your cart.", action: 'navigate', data: { route: '/cart' } });
            }
            if (query.includes('wishlist')) {
                return NextResponse.json({ success: true, reply: "Opening your wishlist.", action: 'navigate', data: { route: '/profile' } }); // Assuming wishlist is in profile or shop
            }
            if (query.includes('order') || query.includes('track')) {
                return NextResponse.json({ success: true, reply: "Opening your orders.", action: 'navigate', data: { route: '/profile' } });
            }
            if (query.includes('checkout') || query.includes('pay')) {
                return NextResponse.json({ success: true, reply: "Taking you to secure checkout now.", action: 'navigate', data: { route: '/checkout' } });
            }
            if (query.includes('profile') || query.includes('setting') || query.includes('account')) {
                return NextResponse.json({ success: true, reply: "Opening your profile settings.", action: 'navigate', data: { route: '/profile' } });
            }
            if (query.includes('deals') || query.includes('offer')) {
                return NextResponse.json({ success: true, reply: "Here are today's exclusive deals.", action: 'navigate', data: { route: '/shop' } });
            }

            // Category Navigation
            const matchedCategory = categories.find(c => query.includes(c.toLowerCase()));
            if (query.includes('open') && matchedCategory) {
                 return NextResponse.json({ success: true, reply: `Opening ${matchedCategory} category.`, action: 'navigate', data: { route: `/shop?search=${matchedCategory}` } });
            }

            // Search and Compare Intents
            if (query.includes('show') || query.includes('search') || query.includes('find') || query.includes('compare')) {
                
                let maxPrice = null;
                const priceMatch = query.match(/under (?:₹|\$)?(\d+(?:,\d+)*)/);
                if (priceMatch) {
                    maxPrice = parseInt(priceMatch[1].replace(/,/g, ''));
                }

                // Filter Products
                let matchedProducts = productDummyData.filter(product => {
                    const matchesName = product.name.toLowerCase().includes(query.replace(/show|me|search|for|find|compare/g, '').trim());
                    const matchesCategory = matchedCategory ? product.category === matchedCategory : false;
                    const matchesPrice = maxPrice ? product.price <= maxPrice : true;
                    return (matchesName || matchesCategory) && matchesPrice;
                });

                // Fallback broad search if precise fails
                if (matchedProducts.length === 0) {
                     matchedProducts = productDummyData.filter(product => {
                        return query.includes(product.category.toLowerCase()) || query.includes(product.name.split(' ')[0].toLowerCase());
                     });
                     if (maxPrice) matchedProducts = matchedProducts.filter(p => p.price <= maxPrice);
                }

                if (matchedProducts.length === 0) {
                    responseText = "I couldn't find any products matching your exact request. Could you try searching for something else?";
                    action = 'chat';
                } else if (matchedProducts.length === 1) {
                    responseText = `I found exactly what you're looking for: ${matchedProducts[0].name}. Opening the product page now.`;
                    action = 'navigate';
                    actionData = { route: `/product/${matchedProducts[0].id}` };
                    recommendedProducts = matchedProducts;
                } else {
                    responseText = `I found ${matchedProducts.length} items that match your request. I've highlighted them for you below and redirected you to the shop.`;
                    action = 'navigate';
                    actionData = { route: `/shop?search=${matchedCategory || matchedProducts[0].category}` };
                    recommendedProducts = matchedProducts.slice(0, 4); // Send top 4 to chat
                }
            
            } else if (query.includes('add') && query.includes('cart')) {
                // Mock adding the first found product or a default if no context
                responseText = "I've added the item to your cart. You now have a few items waiting for checkout.";
                action = 'add_cart';
                actionData = { productId: 'prod_1' }; 
            
            } else if (query.includes('hi') || query.includes('hello')) {
                responseText = "Hello! I am your AI Shopping Assistant. You can ask me to search for products, compare items, navigate to your cart, or check your orders.";
            } else {
                responseText = "I can certainly help with that. Feel free to ask me to search for something specific, or say 'Go to Cart'!";
            }
        }

        // Slight delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 800));

        return NextResponse.json({
            success: true,
            reply: responseText,
            action,
            data: actionData,
            products: recommendedProducts
        });

    } catch (error) {
        console.error("AI Assistant Error:", error);
        return NextResponse.json({ success: false, error: "Failed to process request." }, { status: 500 });
    }
}
