import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description, gradient }) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="bg-white/80  backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl ${gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
}