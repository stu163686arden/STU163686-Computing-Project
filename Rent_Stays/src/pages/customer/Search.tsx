
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Search as SearchIcon, Home, Zap, Building, Filter, X, Check, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/customer/Navbar";
import PropertyCard from "@/components/customer/PropertyCard";
import ChatWidget from "@/components/shared/ChatWidget";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
    { id: "all", label: "All Types", icon: Home },
    { id: "Apartment", label: "Apartments", icon: Building },
    { id: "Studio", label: "Studio", icon: Zap },
    { id: "Shared", label: "Shared", icon: Home },
    { id: "House", label: "House", icon: Home },
];

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]); // Always active, default to full range
    const [category, setCategory] = useState("all");

    const [isPriceOpen, setIsPriceOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const { data: properties, isLoading } = useQuery({
        queryKey: ["search-properties"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("properties")
                .select("*")
                .eq("status", "available");

            if (error) throw error;

            return data.map(property => ({
                id: property.id,
                title: property.title,
                slug: property.slug,
                location: property.city,
                price: property.price,
                image: property.images?.[0] || "",
                beds: property.bedrooms,
                baths: Number(property.bathrooms),
                sqft: property.sqft,
                available: property.status === 'available',
                category: property.type || "Apartment",
                coordinates: {
                    lat: -33.9249, // Mock default coordinates
                    lng: 18.4241
                }
            }));
        },
    });

    // Check if price filter is active (not at default full range)
    const isPriceFilterActive = priceRange[0] !== 0 || priceRange[1] !== 10000;

    // Filter Logic
    const filteredProperties = properties?.filter(property => {
        // Search Term Filter
        const matchesSearch = searchTerm === "" ||
            property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.location.toLowerCase().includes(searchTerm.toLowerCase());

        // Category Filter - only apply if not "all"
        const matchesCategory = category === "all" || property.category === category;

        // Price Filter - always apply current range
        const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];

        return matchesSearch && matchesCategory && matchesPrice;
    }) || [];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 py-8">
                {/* Main Content Container */}
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mb-12 space-y-8 flex flex-col items-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-2 text-center w-full"
                        >
                            <h1 className="text-4xl font-bold tracking-tight">Find Your <span className="gradient-text">Perfect Stay</span></h1>
                            <p className="text-muted-foreground text-lg">Discover the best student accommodations near you</p>
                        </motion.div>

                        {/* Search and Filters */}
                        <div className="flex flex-col gap-6 w-full items-center">
                            {/* Search Input */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="relative group w-full max-w-2xl"
                            >
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors z-10" />
                                <input
                                    type="text"
                                    placeholder="Search by location, property name..."
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-input bg-background/50 backdrop-blur-xl hover:bg-background/80 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 outline-none text-lg shadow-sm hover:shadow-md"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </motion.div>

                            {/* Filters Row */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap gap-3 justify-center"
                            >
                                {/* Price Filter Popover */}
                                <Popover open={isPriceOpen} onOpenChange={setIsPriceOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("rounded-full h-10 px-6 border-input hover:border-primary hover:text-primary transition-all shadow-sm bg-background/50", isPriceFilterActive ? "border-primary text-primary bg-primary/5" : "")}>
                                            Price Range
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-96 p-6 rounded-2xl shadow-xl border-border/50 backdrop-blur-sm bg-background/95" align="center">
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-lg leading-none tracking-tight">Price Range</h4>
                                                <p className="text-sm text-muted-foreground">Set your monthly budget</p>
                                            </div>

                                            {/* Slider with dynamic color - updates in real-time */}
                                            <div className="pt-2 pb-6 px-1">
                                                <Slider
                                                    defaultValue={[0, 10000]}
                                                    max={10000}
                                                    step={100}
                                                    value={priceRange}
                                                    onValueChange={(value) => setPriceRange(value as [number, number])}
                                                    className="py-2"
                                                    rangeClassName={cn(
                                                        "transition-colors duration-300",
                                                        priceRange[1] < 3000 ? "bg-emerald-500" :
                                                            priceRange[1] < 6000 ? "bg-amber-500" :
                                                                "bg-rose-500"
                                                    )}
                                                />
                                            </div>

                                            {/* Manual Inputs - update in real-time */}
                                            <div className="flex items-center gap-4">
                                                <div className="space-y-2 flex-1">
                                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Min Price</label>
                                                    <div className="relative group">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">£</span>
                                                        <Input
                                                            type="number"
                                                            value={priceRange[0]}
                                                            onChange={(e) => {
                                                                const val = Math.min(Number(e.target.value), priceRange[1]);
                                                                setPriceRange([val, priceRange[1]]);
                                                            }}
                                                            className="pl-7 rounded-xl border-input/50 bg-secondary/20 focus:bg-background transition-all hover:border-primary/50"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2 flex-1">
                                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Max Price</label>
                                                    <div className="relative group">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">£</span>
                                                        <Input
                                                            type="number"
                                                            value={priceRange[1]}
                                                            onChange={(e) => {
                                                                const val = Math.max(Number(e.target.value), priceRange[0]);
                                                                setPriceRange([priceRange[0], val]);
                                                            }}
                                                            className="pl-7 rounded-xl border-input/50 bg-secondary/20 focus:bg-background transition-all hover:border-primary/50"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end border-t border-border/50 pt-6 mt-2">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setPriceRange([0, 10000]);
                                                        setIsPriceOpen(false);
                                                    }}
                                                    className="hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                                                >
                                                    Reset Filter
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {/* Category Filter Popover */}
                                <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("rounded-full h-10 px-6 border-input hover:border-primary hover:text-primary transition-all shadow-sm bg-background/50", category !== "all" ? "border-primary text-primary bg-primary/5" : "")}>
                                            {category === "all" ? "Property Type" : CATEGORIES.find(c => c.id === category)?.label}
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-6 rounded-2xl shadow-xl border-border/50 backdrop-blur-sm bg-background/95" align="start">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-lg leading-none tracking-tight">Property Type</h4>
                                                <p className="text-sm text-muted-foreground">Select the type of accommodation</p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-2">
                                                {CATEGORIES.map((cat) => (
                                                    <div
                                                        key={cat.id}
                                                        onClick={() => {
                                                            setCategory(cat.id);
                                                            setIsCategoryOpen(false);
                                                        }}
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent",
                                                            category === cat.id
                                                                ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                                                                : "hover:bg-secondary/50 hover:border-border/50 text-muted-foreground hover:text-foreground"
                                                        )}
                                                    >
                                                        <cat.icon className={cn("w-5 h-5", category === cat.id ? "text-primary" : "text-muted-foreground")} />
                                                        <span className="font-medium">{cat.label}</span>
                                                        {category === cat.id && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="ml-auto"
                                                            >
                                                                <Check className="w-4 h-4 text-primary" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </motion.div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                            {filteredProperties.length > 0 ? (
                                filteredProperties.map((property, index) => (
                                    <PropertyCard
                                        key={property.id}
                                        {...property}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                                        <SearchIcon className="w-10 h-10 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-2">No properties found</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                                        We couldn't find any properties matching your criteria. Try adjusting your filters or search for a different location.
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setCategory("all");
                                            setPriceRange(null);
                                        }}
                                        size="lg"
                                        className="rounded-full"
                                    >
                                        Clear all filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ChatWidget />
        </div>
    );
};

export default Search;
