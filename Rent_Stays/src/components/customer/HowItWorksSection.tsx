import { motion } from "framer-motion";
import { Search, CalendarCheck, Home } from "lucide-react";

const steps = [
    {
        icon: Search,
        title: "Search",
        description: "Browse hundreds of verified student accommodations near your campus."
    },
    {
        icon: CalendarCheck,
        title: "Book",
        description: "Schedule a viewing or book instantly online with secure payment."
    },
    {
        icon: Home,
        title: "Move In",
        description: "Get your keys and settle into your new fully-furnished home."
    }
];

const HowItWorksSection = () => {
    return (
        <section className="py-24 bg-secondary/30">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        How It <span className="gradient-text">Works</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Your journey to the perfect student home in three simple steps.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="text-center relative bg-background/50 md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none"
                        >
                            <div className="w-24 h-24 mx-auto bg-background rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-secondary relative z-10">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <step.icon className="w-8 h-8" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
