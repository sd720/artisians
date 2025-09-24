import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductGenerator from "../components/ProductGenerator.js";
import CustomerChatbot from "../Components/CustomerChatbot.js";
import FeatureCard from "../components/FeatureCard.js";
import { Sparkles, MessageCircle, Palette, Shield, Zap, Heart } from "lucide-react";

export default function Marketplace() {
    const [activeTab, setActiveTab] = useState('generator');

    const features = [
        {
            icon: Sparkles,
            title: "AI-Powered Descriptions",
            description: "Generate compelling product descriptions that highlight craftsmanship and appeal to customers",
            gradient: "bg-gradient-to-br from-blue-500 to-blue-600"
        },
        {
            icon: MessageCircle,
            title: "Smart Customer Support",
            description: "Provide instant, intelligent responses to customer inquiries about products and services",
            gradient: "bg-gradient-to-br from-purple-500 to-purple-600"
        },
        {
            icon: Palette,
            title: "Artisan-Focused",
            description: "Designed specifically for handmade and artisan products with emphasis on uniqueness",
            gradient: "bg-gradient-to-br from-pink-500 to-pink-600"
        },
        {
            icon: Shield,
            title: "Professional Quality",
            description: "Production-ready descriptions that maintain consistency and professional standards",
            gradient: "bg-gradient-to-br from-green-500 to-green-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center text-white"
                    >
                        <div className="flex items-center justify-center mb-6">
                            <Zap className="w-12 h-12 text-yellow-300 mr-4" />
                            <h1 className="text-5xl md:text-6xl font-bold">
                                AI Marketplace Assistant
                            </h1>
                        </div>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Empower local artisans with AI-generated product descriptions and intelligent customer support
                        </p>
                        <div className="flex items-center justify-center gap-2 text-lg">
                            <Heart className="w-6 h-6 text-red-400" />
                            <span>Built for artisans, powered by AI</span>
                        </div>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-50 to-transparent"></div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                        Everything You Need to Succeed
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Professional tools designed to help artisans showcase their work and serve customers better
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                        >
                            <FeatureCard {...feature} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Interactive Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        Try Our AI Tools
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Experience the power of AI-driven marketplace assistance
                    </p>

                    <div className="flex justify-center mb-8">
                        <div className="bg-white rounded-2xl p-2 shadow-lg">
                            <Button
                                variant={activeTab === 'generator' ? 'default' : 'ghost'}
                                onClick={() => setActiveTab('generator')}
                                className={`px-8 py-3 rounded-xl transition-all duration-300 ${
                                    activeTab === 'generator'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <Sparkles className="w-5 h-5 mr-2" />
                                Product Generator
                            </Button>
                            <Button
                                variant={activeTab === 'chat' ? 'default' : 'ghost'}
                                onClick={() => setActiveTab('chat')}
                                className={`px-8 py-3 rounded-xl transition-all duration-300 ml-2 ${
                                    activeTab === 'chat'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Customer Chat
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Tool Interface */}
                <div className="flex justify-center">
                    <AnimatePresence mode="wait">
                        {activeTab === 'generator' && (
                            <motion.div
                                key="generator"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProductGenerator />
                            </motion.div>
                        )}
                        {activeTab === 'chat' && (
                            <motion.div
                                key="chat"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CustomerChatbot />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-lg text-gray-300">
                        Empowering artisans with intelligent marketplace solutions
                    </p>
                    <p className="text-gray-400 mt-2">
                        Built with ❤️ for the creative community
                    </p>
                </div>
            </div>
        </div>
    );
}