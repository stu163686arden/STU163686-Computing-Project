import { motion } from "framer-motion";
import { ShieldCheck, Clock, Home, Zap } from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        title: "Verified Listings",
        description: "Every property is personally visited and verified by our team to ensure quality and safety."
    },
    {
        icon: Clock,
        title: "24/7 Support",
        description: "Our dedicated support team is always available to assist you with any issues or queries."
    },
    {
        icon: Home,
        title: "Fully Furnished",
        description: "Move-in ready apartments with premium furniture and modern amenities included."
    },
    {
        icon: Zap,
        title: "Instant Booking",
        description: "Secure your dream home instantly with our streamlined digital booking process."
    }
];

const FeaturesSection = () => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-6 rounded-2xl glass-card border border-border/50 hover:border-primary/50 transition-colors duration-300"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
