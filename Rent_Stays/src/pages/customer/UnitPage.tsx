import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Bed, Bath, Square, Check, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/customer/Navbar";
import MapComponent from "@/components/shared/MapComponent";
import ImageGallery from "@/components/customer/ImageGallery";
import StickyPriceCard from "@/components/customer/StickyPriceCard";
import PropertyCard from "@/components/customer/PropertyCard";
import Footer from "@/components/customer/Footer";
import ChatWidget from "@/components/shared/ChatWidget";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const UnitPage = () => {
  const { slug } = useParams<{ slug: string }>(); // Rename param to slug

  const { data: property, isLoading, error } = useQuery({
    queryKey: ["property", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("slug", slug) // Query by slug
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch other properties for "Other Rooms" section
  const { data: otherProperties } = useQuery({
    queryKey: ["otherProperties", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .neq("slug", slug)
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <p className="text-muted-foreground mb-4">{error instanceof Error ? error.message : "Could not load property"}</p>
          <Link to="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Map DB fields to UI expected fields
  const uiProperty = {
    id: property.id,
    title: property.title,
    location: property.city, // Mapping city to location
    address: property.address,
    price: property.price,
    images: property.images || [],
    beds: property.bedrooms, // Mapping bedrooms to beds
    baths: Number(property.bathrooms), // Mapping bathrooms to baths
    sqft: property.sqft,
    available: property.status === 'available', // Mapping status to boolean
    description: property.description || "",
    features: property.features || [],
    utilities: property.included_utilities || [], // Mapping included_utilities to utilities
    terms: "12-month lease", // Mocking missing field
    moveInDate: property.available_from, // Mapping available_from to moveInDate
    deposit: property.price * 1.5, // Mocking missing field (e.g. 1.5x rent)
  };

  const uiOtherProperties = otherProperties?.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug, // Map slug
    location: p.city,
    address: p.address,
    price: p.price,
    images: p.images || [],
    beds: p.bedrooms,
    baths: Number(p.bathrooms),
    sqft: p.sqft,
    available: p.status === 'available',
    description: p.description || "",
    features: p.features || [],
    utilities: p.included_utilities || [],
    terms: "12-month lease",
    moveInDate: p.available_from,
    deposit: p.price * 1.5,
    image: p.images?.[0] || "", // For PropertyCard
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Back Button */}
      <div className="container mx-auto px-6 pt-24 pb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to listings
        </Link>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-6 mb-12">
        <ImageGallery images={uiProperty.images} title={uiProperty.title} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Title */}
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {uiProperty.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    {uiProperty.address}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 p-6 glass-card rounded-xl mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bed className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{uiProperty.beds}</p>
                    <p className="text-sm text-muted-foreground">Bedroom</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bath className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{uiProperty.baths}</p>
                    <p className="text-sm text-muted-foreground">Bathroom</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Square className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{uiProperty.sqft}</p>
                    <p className="text-sm text-muted-foreground">m²</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">
                  About This Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {uiProperty.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uiProperty.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-4 glass-card rounded-lg"
                    >
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">
                  About the Location
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {uiProperty.location} is a vibrant area popular with students
                  due to its proximity to major universities. The neighborhood
                  offers easy access to public transport, shops, restaurants,
                  and entertainment venues.
                </p>
                <div className="aspect-video rounded-xl overflow-hidden glass-card">
                  <MapComponent
                    address={uiProperty.address}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <StickyPriceCard property={uiProperty} />
          </div>
        </div>

        {/* Other Rooms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Other <span className="gradient-text">Rooms</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uiOtherProperties.map((prop, index) => (
              <PropertyCard
                key={prop.id}
                {...prop}
                image={prop.image} // PropertyCard expects 'image'
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />

      {/* AI Chat Assistant */}
      <ChatWidget />
    </div>
  );
};

export default UnitPage;
