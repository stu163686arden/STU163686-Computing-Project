import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MapComponent from "@/components/shared/MapComponent";
import Navbar from "@/components/customer/Navbar";
import HeroSection from "@/components/customer/HeroSection";
import PropertyCard from "@/components/customer/PropertyCard";
import FAQSection from "@/components/customer/FAQSection";
import Footer from "@/components/customer/Footer";
import FeaturesSection from "@/components/customer/FeaturesSection";
import HowItWorksSection from "@/components/customer/HowItWorksSection";
import TestimonialsSection from "@/components/customer/TestimonialsSection";
import BenefitsSection from "@/components/customer/BenefitsSection";
import NewsletterSection from "@/components/customer/NewsletterSection";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import ChatWidget from "@/components/shared/ChatWidget";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { data: featuredProperties, isLoading } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("featured_properties")
        .select(`
          *,
          property:properties (*)
        `);

      if (error) throw error;

      // Filter for active/available properties and transform to UI format
      return data
        .filter(item => item.property && item.property.status === 'available')
        .map(item => ({
          id: item.property.id,
          title: item.property.title,
          slug: item.property.slug, // Pass slug
          location: item.property.city,
          price: item.property.price,
          image: item.property.images?.[0] || "",
          beds: item.property.bedrooms,
          baths: Number(item.property.bathrooms),
          sqft: item.property.sqft,
          available: item.property.status === 'available'
        }));
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <HeroSection />

      {/* Features Section - Highlights key value props immediately */}
      <FeaturesSection />

      {/* Listings Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Listings</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hand-picked properties near top universities, verified and ready for you to move in
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties?.map((property, index) => (
                  <PropertyCard
                    key={property.id}
                    {...property}
                    index={index}
                  />
                ))}
              </div>

              {/* Browse All Properties Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex justify-center mt-12"
              >
                <Link to="/search">
                  <Button
                    size="lg"
                    className="group px-8 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                  >
                    <span className="flex items-center gap-3">
                      Browse All Properties
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>

      <HowItWorksSection />

      <BenefitsSection />

      {/* Map Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore <span className="gradient-text">Locations</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find properties in the best areas of the city.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-2 rounded-2xl shadow-xl h-[500px]"
          >
            <MapComponent
              className="w-full h-full rounded-xl"
              markers={[
                { lat: -33.9249, lng: 18.4241, title: "City Centre" },
                { lat: -33.9280, lng: 18.4200, title: "Bo-Kaap" },
                { lat: -33.9100, lng: 18.4100, title: "Waterfront" }
              ]}
            />
          </motion.div>
        </div>
      </section>

      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-secondary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-accent/10" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Can't Find What You're{" "}
              <span className="gradient-text">Looking For?</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Tell us your preferences and we'll notify you when the perfect
              property becomes available.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold glow-shadow transition-all duration-300"
            >
              Get Notified
            </motion.button>
          </motion.div>
        </div>
      </section>

      <NewsletterSection />

      <div id="faq">
        <FAQSection />
      </div>
      <Footer />

      {/* AI Chat Assistant */}
      <ChatWidget />
    </div>
  );
};

export default Index;
