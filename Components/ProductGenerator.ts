import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvokeLLM } from "@/integrations/Core";
import { Product } from "@/entities/Product";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
    "Jewelry", "Pottery", "Textiles", "Woodwork", "Metalwork", 
    "Glass Art", "Leather Goods", "Paintings", "Sculptures", "Home Decor"
];

export default function ProductGenerator() {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        materials: '',
        price: ''
    });
    const [generatedDescription, setGeneratedDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const generateDescription = async () => {
        if (!formData.name || !formData.category) {
            setError('Please fill in at least the product name and category');
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            const prompt = `Create a compelling, professional product description for an artisan marketplace. 

Product Details:
- Name: ${formData.name}
- Category: ${formData.category}
- Materials: ${formData.materials || 'Not specified'}
- Price: ${formData.price ? `$${formData.price}` : 'Contact for pricing'}

Write a description that:
- Highlights the craftsmanship and unique qualities
- Appeals to customers looking for handmade, authentic items
- Mentions the materials and construction process
- Creates an emotional connection
- Is 100-150 words
- Has a professional, engaging tone

Focus on the artisan's skill, the product's uniqueness, and why someone would want to own this piece.`;

            const response = await InvokeLLM({
                prompt,
                add_context_from_internet: false
            });

            setGeneratedDescription(response);

            // Save to database
            await Product.create({
                name: formData.name,
                category: formData.category,
                materials: formData.materials,
                price: formData.price ? parseFloat(formData.price) : null,
                generated_description: response
            });

        } catch (err) {
            setError('Failed to generate description. Please try again.');
            console.error('Generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedDescription);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    AI Product Description Generator
                </CardTitle>
                <p className="text-gray-600 mt-2">Create compelling descriptions for your artisan products</p>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                            id="name"
                            placeholder="Handwoven Silk Scarf"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="border-gray-200 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select 
                            value={formData.category} 
                            onValueChange={(value) => handleInputChange('category', value)}
                        >
                            <SelectTrigger className="border-gray-200 focus:border-blue-500">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="materials">Materials</Label>
                        <Input
                            id="materials"
                            placeholder="100% silk, hand-dyed"
                            value={formData.materials}
                            onChange={(e) => handleInputChange('materials', e.target.value)}
                            className="border-gray-200 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder="85"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            className="border-gray-200 focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
                    >
                        {error}
                    </motion.div>
                )}

                <Button
                    onClick={generateDescription}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Description
                        </>
                    )}
                </Button>

                <AnimatePresence>
                    {generatedDescription && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold">Generated Description</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyToClipboard}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 mr-1 text-green-500" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-1" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                            <Textarea
                                value={generatedDescription}
                                readOnly
                                className="min-h-[120px] bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 resize-none"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}