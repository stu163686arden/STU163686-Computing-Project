import { motion } from "framer-motion";
import { Sparkles, Wifi, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const BenefitsSection = () => {
    return (
        <section className="py-24 bg-secondary/20 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800&h=1000"
                                alt="Students studying together"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <div className="text-white">
                                    <p className="font-bold text-lg mb-2">Community Driven</p>
                                    <p className="text-white/80 text-sm">Join a vibrant community of students</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10" />
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-10" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex-1"
                    >
                        <div className="mb-2 flex items-center gap-2 text-primary font-medium">
                            <Sparkles className="w-5 h-5" />
                            <span>Why Choose Us</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            More Than Just A <span className="gradient-text">Place To Sleep</span>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8">
                            We provide an ecosystem designed for student success, combining comfort, safety, and community.
                        </p>

                        <div className="space-y-6 mb-10">
                            {[
                                { icon: Wifi, title: "High-Speed WiFi", desc: "Gigabit internet included in every room for seamless study sessions." },
                                { icon: Shield, title: "Secure Living", desc: "Biometric access control and 24/7 security monitoring." },
                                { icon: Users, title: "Study Zones", desc: "Dedicated quiet spaces and collaborative study rooms." }
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{item.title}</h4>
                                        <p className="text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button size="lg" className="rounded-xl px-8">
                            Explore Amenities
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
