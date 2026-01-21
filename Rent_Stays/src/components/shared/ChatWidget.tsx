import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    propertyLinks?: { title: string; slug: string; price: number; image?: string }[];
}

interface Property {
    id: string;
    title: string;
    slug: string;
    city: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    features: string[];
    status: string;
}

const SYSTEM_PROMPT = `You are a friendly property assistant for Rent&Stay, a student accommodation platform.

# Primary Objectives
- Help students find rental properties near universities
- Understand preferences: budget, location, bedrooms, amenities
- Suggest suitable properties and explain the rental process

# Response Guidelines

## Tone & Length
- Friendly, conversational, and student-focused
- Keep responses under 150 words unless detailed property info is requested
- Use simple, clear language

## Property Suggestions Format
When suggesting properties, structure as:
- **[Property Title]** - £[price]/month
- [Bedrooms] bedrooms | [Key amenity 1], [Key amenity 2]
- View: /property/[slug]

Example:
- **Modern City Centre Studio** - £850/month
- 1 bedroom | WiFi included, 5 min to campus
- View: /property/modern-city-centre-studio

## What NOT to Do
- Don't suggest properties without exact titles, prices, and slugs
- Don't use overly formal or sales-heavy language
- Don't provide property details if none match their criteria

## Handling No Matches
If no properties match: "I don't have properties matching [criteria] right now. Would you like me to notify you when one becomes available, or shall we adjust the search?"

# Information to Gather
Before suggesting properties, confirm:
1. University/location
2. Budget range
3. Number of bedrooms needed
4. Must-have amenities (if any)`;

const formatMessage = (content: string) => {
    // Split by lines to handle list items and paragraphs
    const lines = content.split('\n');
    const formattedElements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    lines.forEach((line, index) => {
        // Handle bold text (**text**)
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const formattedLine = parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
            }
            return part;
        });

        // Handle bullet points
        if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
            listItems.push(
                <li key={`li-${index}`} className="ml-4 list-disc pl-1">
                    {formattedLine.length > 1 ? formattedLine : formattedLine[0]}
                </li>
            );
        } else {
            // Flush any accumulated list items
            if (listItems.length > 0) {
                formattedElements.push(
                    <ul key={`ul-${index}`} className="my-2 space-y-1">
                        {listItems}
                    </ul>
                );
                listItems = [];
            }

            // Only add non-empty lines as paragraphs
            if (line.trim()) {
                formattedElements.push(
                    <p key={`p-${index}`} className="mb-1 last:mb-0 leading-relaxed">
                        {formattedLine.length > 1 ? formattedLine : formattedLine[0]}
                    </p>
                );
            }
        }
    });

    // Flush remaining list items
    if (listItems.length > 0) {
        formattedElements.push(
            <ul key="ul-last" className="my-2 space-y-1">
                {listItems}
            </ul>
        );
    }

    return formattedElements;
};

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Show tooltip on first visit
    useEffect(() => {
        const hasSeenTooltip = localStorage.getItem('chatTooltipSeen');
        if (!hasSeenTooltip) {
            const timer = setTimeout(() => {
                setShowTooltip(true);
            }, 2000); // Show after 2 seconds
            return () => clearTimeout(timer);
        }
    }, []);

    const handleCloseTooltip = () => {
        setShowTooltip(false);
        localStorage.setItem('chatTooltipSeen', 'true');
    };

    const sendMessage = async (messageOverride?: string) => {
        const messageText = messageOverride || input;
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const conversationHistory = messages.map(m => ({
                role: m.role,
                content: m.content
            }));

            const { data, error } = await supabase.functions.invoke('chat', {
                body: {
                    message: messageText,
                    conversationHistory: conversationHistory.slice(-6),
                    systemPrompt: SYSTEM_PROMPT
                }
            });

            if (error) throw new Error(error.message || 'Failed to get response');

            if (data?.error) {
                throw new Error(data.error);
            }

            const propertyLinks = data.properties?.filter((p: any) =>
                data.response.toLowerCase().includes(p.title.toLowerCase()) ||
                data.response.includes(p.slug)
            ).slice(0, 3) || [];

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response,
                propertyLinks: propertyLinks.length > 0 ? propertyLinks : undefined
            }]);
        } catch (error: any) {
            console.error('Chat error:', error);
            let errorMessage = error.message || 'Sorry, I encountered an error. Please try again.';

            if (error.message?.includes('Rate limit')) {
                errorMessage = 'Too many messages! Please wait a moment.';
            }

            // Temporary: Show technical details for debugging if it's a configuration error
            if (errorMessage.includes('OpenAI') || errorMessage.includes('key') || errorMessage.includes('configured')) {
                errorMessage += ' (Please check your Supabase secrets)';
            }

            setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickQuestions = [
        "Find me a studio apartment",
        "Properties under £900/month",
        "2 bedrooms near campus",
    ];

    return (
        <>
            <>
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => setIsOpen(true)}
                            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-primary to-blue-600 rounded-full shadow-2xl flex items-center justify-center z-50 group hover:shadow-primary/25 transition-shadow"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Open chat assistant"
                        >
                            <MessageCircle className="w-8 h-8 text-white drop-shadow-md" />
                            <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Tooltip Popover */}
                <AnimatePresence>
                    {showTooltip && !isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="fixed bottom-24 right-6 z-50 w-64"
                        >
                            <div className="relative bg-white dark:bg-card border border-border/50 rounded-2xl shadow-2xl p-4">
                                {/* Close button */}
                                <button
                                    onClick={handleCloseTooltip}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
                                    aria-label="Close tooltip"
                                >
                                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>

                                {/* Content */}
                                <div className="pr-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                        <h4 className="font-bold text-sm text-foreground">Rent&Stay AI</h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Need help finding a property? I can assist you with searching, checking availability, and answering questions!
                                    </p>
                                </div>

                                {/* Arrow pointing to chat button */}
                                <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white dark:bg-card border-r border-b border-border/50 transform rotate-45" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden ring-1 ring-black/5"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-blue-600 text-white shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg tracking-tight">Rent&Stay AI</h3>
                                    <p className="text-xs text-white/90 font-medium">Always here to help</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-secondary/10 scroll-smooth">
                            {messages.length === 0 && (
                                <div className="text-center py-8 px-4">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center ring-8 ring-primary/5">
                                        <Sparkles className="w-10 h-10 text-primary" />
                                    </div>
                                    <h4 className="font-bold text-xl mb-3 text-foreground">How can I help you?</h4>
                                    <p className="text-muted-foreground mb-8 leading-relaxed">
                                        I can find student accommodation, check availability, or answer questions about the area.
                                    </p>

                                    <div className="grid gap-2">
                                        {quickQuestions.map((q, i) => (
                                            <motion.button
                                                key={i}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => sendMessage(q)}
                                                className="w-full text-left text-sm font-medium px-4 py-3 rounded-xl bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-foreground/80"
                                            >
                                                {q}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center border border-primary/20 mt-1">
                                            <Bot className="w-5 h-5 text-primary" />
                                        </div>
                                    )}
                                    <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'order-1' : ''}`}>
                                        <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-none font-medium'
                                            : 'bg-white dark:bg-card border border-border/50 rounded-bl-none text-foreground'
                                            }`}>
                                            {/* Render parsed markdown content */}
                                            {formatMessage(msg.content)}
                                        </div>

                                        {msg.propertyLinks && msg.propertyLinks.length > 0 && (
                                            <div className="grid gap-2 mt-3">
                                                {msg.propertyLinks.map((link, j) => (
                                                    <a
                                                        key={j}
                                                        href={`/property/${link.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                                                    >
                                                        {/* Property Image */}
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                                            {link.image ? (
                                                                <img
                                                                    src={link.image}
                                                                    alt={link.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                                                    <Sparkles className="w-6 h-6 text-primary/50" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Property Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                                                {link.title}
                                                            </h5>
                                                            <p className="text-primary font-bold text-sm">
                                                                £{link.price.toLocaleString()}/month
                                                            </p>
                                                            <span className="text-xs text-muted-foreground">
                                                                Click to view →
                                                            </span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center order-2 shadow-lg mt-1">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3 items-center"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <Bot className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="bg-white dark:bg-card border border-border/50 rounded-2xl rounded-bl-none p-4 shadow-sm">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-primary/60 rounded-full animate-[bounce_1s_infinite_0ms]" />
                                            <span className="w-2 h-2 bg-primary/60 rounded-full animate-[bounce_1s_infinite_200ms]" />
                                            <span className="w-2 h-2 bg-primary/60 rounded-full animate-[bounce_1s_infinite_400ms]" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-background border-t border-border/50">
                            <div className="flex gap-2 relative">
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask anything..."
                                    disabled={isLoading}
                                    className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-border/50 bg-secondary/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium disabled:opacity-50"
                                />
                                <div className="absolute right-2 top-1.5">
                                    <Button
                                        onClick={() => sendMessage()}
                                        disabled={isLoading || !input.trim()}
                                        size="icon"
                                        className={`w-9 h-9 rounded-lg transition-all ${input.trim()
                                            ? 'bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg hover:scale-105'
                                            : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default ChatWidget;
