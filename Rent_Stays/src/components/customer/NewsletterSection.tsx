import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewsletterSection = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 -z-10" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden"
                >
                    {/* Background pattern */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                    </div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <Mail className="w-16 h-16 mx-auto mb-6 text-white/80" />
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                            Stay in the Loop
                        </h2>
                        <p className="text-white/80 text-lg mb-10">
                            Join our newsletter to get the latest updates on new listings, student tips, and exclusive offers.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20 transition-all font-medium"
                            />
                            <Button className="bg-white text-primary hover:bg-white/90 rounded-xl px-8 py-6 text-lg font-bold">
                                Subscribe <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default NewsletterSection;
