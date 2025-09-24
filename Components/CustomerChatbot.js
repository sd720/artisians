import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InvokeLLM } from "@/integrations/Core";
import { ChatMessage } from "@/entities/ChatMessage";
import { User } from "@/entities/User";
import { MessageCircle, Send, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomerChatbot() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            message: "Hello! I'm your AI marketplace assistant. I can help you with product questions, shipping information, customization requests, and more. How can I help you today?",
            is_ai: true,
            timestamp: new Date().toISOString()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollAreaRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isTyping) return;

        const userMessage = {
            id: Date.now(),
            message: inputMessage.trim(),
            is_ai: false,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            // Save user message
            await ChatMessage.create({
                message: userMessage.message,
                is_ai: false,
                timestamp: userMessage.timestamp
            });

            const prompt = `You are a helpful customer support assistant for an artisan marketplace. You help customers with:
- Product information and recommendations
- Shipping and delivery questions  
- Customization and special requests
- Order status and returns
- General marketplace guidance

Be friendly, professional, and knowledgeable. Keep responses concise but helpful.

Customer message: "${inputMessage.trim()}"

Provide a helpful response that addresses their question or concern.`;

            const aiResponse = await InvokeLLM({
                prompt,
                add_context_from_internet: false
            });

            const aiMessage = {
                id: Date.now() + 1,
                message: aiResponse,
                is_ai: true,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMessage]);

            // Save AI message
            await ChatMessage.create({
                message: aiMessage.message,
                is_ai: true,
                timestamp: aiMessage.timestamp
            });

        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                message: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
                is_ai: true,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl h-[600px] flex flex-col">
            <CardHeader className="text-center pb-4 flex-shrink-0">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                    <MessageCircle className="w-6 h-6 text-blue-500" />
                    Customer Support Chat
                </CardTitle>
                <p className="text-gray-600 text-sm">Ask me anything about our products and services</p>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                    <div className="space-y-4">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`flex items-start gap-3 ${
                                        message.is_ai ? 'justify-start' : 'justify-end'
                                    }`}
                                >
                                    {message.is_ai && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    
                                    <div
                                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                                            message.is_ai
                                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        }`}
                                    >
                                        <p className={`text-sm ${message.is_ai ? 'text-gray-800' : 'text-white'}`}>
                                            {message.message}
                                        </p>
                                        <p className={`text-xs mt-1 ${
                                            message.is_ai ? 'text-gray-500' : 'text-blue-100'
                                        }`}>
                                            {new Date(message.timestamp).toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </p>
                                    </div>

                                    {!message.is_ai && (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                            <UserIcon className="w-4 h-4 text-gray-600" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-4 py-3 rounded-2xl">
                                    <div className="flex items-center gap-1">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                        <span className="text-sm text-gray-600">AI is typing...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t border-gray-200 bg-white/50">
                    <div className="flex gap-2">
                        <Input
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            disabled={isTyping}
                            className="flex-1 border-gray-200 focus:border-blue-500 transition-colors"
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isTyping}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}