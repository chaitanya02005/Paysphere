'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Bot, Mic, Send, X, Image as ImageIcon, Volume2, VolumeX, Loader2 } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hello! I am your AI Shopping Assistant. How can I help you today?' }])
    const [inputText, setInputText] = useState('')
    const [isListening, setIsListening] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [voiceEnabled, setVoiceEnabled] = useState(true)
    
    const messagesEndRef = useRef(null)
    const fileInputRef = useRef(null)
    const recognitionRef = useRef(null)
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useDispatch()

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        // Initialize Speech Recognition
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                handleSend(transcript, 'voice');
                setIsListening(false);
            };
            
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
                toast.error("Voice recognition failed.");
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const speak = (text) => {
        if (!voiceEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }

    const handleSend = async (text, type = 'text') => {
        if (!text.trim() && type === 'text') return;
        
        const payload = text;
        setInputText('');
        setMessages(prev => [...prev, { sender: 'user', text: type === 'image' ? '[Image Uploaded]' : payload }]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, payload, context: { pathname } })
            });
            const data = await res.json();
            
            if (data.success) {
                setMessages(prev => [...prev, { sender: 'ai', text: data.reply, products: data.products }]);
                speak(data.reply);
                
                // Handle Actions
                if (data.action === 'navigate' && data.data?.route) {
                    router.push(data.data.route);
                } else if (data.action === 'back') {
                    router.back();
                } else if (data.action === 'add_cart' && data.data?.productId) {
                    dispatch(addToCart({ productId: data.data.productId }));
                    toast.success('Added to cart via AI');
                }
            } else {
                toast.error("AI is unavailable right now.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error connecting to AI.");
        } finally {
            setIsLoading(false);
        }
    }

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                    setIsListening(true);
                } catch(e) {
                    toast.error("Microphone in use or blocked.");
                }
            } else {
                toast.error("Speech recognition not supported in this browser.");
            }
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Simulate image processing
            handleSend("Image Data", "image");
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* AI Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] bg-white/90 backdrop-blur-xl border border-neutral-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-neutral-900 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot size={20} className="text-white" />
                            <h3 className="font-semibold text-sm tracking-wide">AI Assistant</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="text-neutral-400 hover:text-white transition">
                                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white transition">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-3 text-sm rounded-xl ${msg.sender === 'user' ? 'bg-neutral-900 text-white rounded-tr-none' : 'bg-neutral-100 text-neutral-800 rounded-tl-none border border-neutral-200 shadow-sm'}`}>
                                    {msg.text}
                                </div>
                                {msg.products && msg.products.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto py-2 w-full max-w-[90%] hide-scrollbar mt-1">
                                        {msg.products.map(product => (
                                            <div key={product.id} onClick={() => router.push(`/product/${product.id}`)} className="min-w-[130px] bg-white border border-neutral-200 rounded-lg p-2 cursor-pointer hover:border-neutral-400 transition-colors shadow-sm flex flex-col gap-1.5 shrink-0">
                                                <div className="w-full h-20 relative bg-neutral-50 rounded-sm overflow-hidden">
                                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover mix-blend-multiply" />
                                                </div>
                                                <p className="text-[11px] font-semibold text-neutral-900 truncate">{product.name}</p>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <p className="text-[11px] font-medium text-neutral-600">${product.price}</p>
                                                    <button className="text-[9px] font-medium bg-neutral-900 text-white px-2 py-1 rounded-sm hover:bg-neutral-800">View</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-neutral-100 p-3 rounded-xl rounded-tl-none flex gap-1 items-center border border-neutral-200">
                                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-neutral-100">
                        <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-full p-1.5 shadow-sm">
                            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors">
                                <ImageIcon size={18} />
                            </button>
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                            
                            <input 
                                type="text" 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
                                placeholder="Ask me anything..." 
                                className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-800 placeholder-neutral-400 px-2"
                            />
                            
                            <button 
                                onClick={toggleListen} 
                                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500' : 'text-neutral-500 hover:text-neutral-900'}`}
                            >
                                {isListening ? <Loader2 size={18} className="animate-spin" /> : <Mic size={18} />}
                            </button>
                            
                            <button onClick={() => handleSend(inputText)} className="p-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors">
                                <Send size={16} className="-ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all group"
                >
                    <Bot size={26} className="group-hover:rotate-12 transition-transform" />
                </button>
            )}
        </div>
    )
}

export default AIAssistant
