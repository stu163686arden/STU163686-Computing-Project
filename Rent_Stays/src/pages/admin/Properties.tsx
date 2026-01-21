import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search, Filter, Grid, List, SlidersHorizontal, Loader2, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/admin/properties/PropertyCard";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const categories = ["All", "Apartment", "Villa", "Cabin", "Townhouse", "Featured"];
const statuses = ["All", "Available", "Occupied", "Maintenance", "Reserved"];

export default function Properties() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // State for properties data
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch properties from Supabase
  const fetchProperties = async () => {
    try {
      setLoading(true);
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }

      // Fetch properties - filter by owner_id if user is available
      let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by owner_id to show only properties owned by current admin
      if (user) {
        query = query.eq('owner_id', user.id);
      }

      const { data: propertiesData, error: propertiesError } = await query;

      if (propertiesError) throw propertiesError;

      // Fetch featured properties references
      const { data: featuredData, error: featuredError } = await supabase
        .from('featured_properties')
        .select('property_id');

      if (featuredError) throw featuredError;

      const featuredIds = new Set(featuredData?.map(f => f.property_id));

      if (propertiesData) {
        // Map DB snake_case to frontend camelCase
        const mappedProperties = propertiesData.map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          address: p.address,
          price: p.price,
          promotionalPrice: p.promotional_price,
          status: p.status,
          category: p.category,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          sqft: p.sqft,
          availableFrom: new Date(p.available_from).toLocaleDateString(),
          image: p.images && p.images.length > 0 ? p.images[0] : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop", // Default fallback
          isFeatured: featuredIds.has(p.id)
        }));

        setProperties(mappedProperties);
      }
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to load properties. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleToggleFeature = async (id: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        // Remove from featured_properties
        console.log("Removing from featured:", id);
        const { error } = await supabase
          .from('featured_properties')
          .delete()
          .eq('property_id', id);

        if (error) {
          console.error("Supabase Error (Delete):", error);
          throw error;
        }

        toast({ title: "Removed from Featured", description: "Property removed from homepage." });
      } else {
        // Add to featured_properties
        console.log("Adding to featured:", id);
        // Note: Using select() after insert to verify helps debug sometimes, but simple insert should work
        const { error } = await supabase
          .from('featured_properties')
          .insert([{ property_id: id }]);

        if (error) {
          console.error("Supabase Error (Insert):", error);
          // Handle Duplicate Key error gracefully if it happens
          if (error.code === '23505') { // Unique violation
            toast({ title: "Already Featured", description: "This property is already in the featured list." });
            return;
          }
          throw error;
        }

        toast({ title: "Added to Featured", description: "Property now featured on homepage!" });
      }

      // Optimistic update
      setProperties(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !currentStatus } : p));

    } catch (error: any) {
      console.error("Toggle Feature Error:", error);
      toast({
        title: "Error",
        description: `Failed to update featured status: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      // First remove from featured_properties if exists
      await supabase
        .from('featured_properties')
        .delete()
        .eq('property_id', id);

      // Then delete the property
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Property Deleted",
        description: "The property has been permanently removed.",
      });

      // Remove from local state
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (error: any) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: `Failed to delete property: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase());

    // Updated category matching logic
    let matchesCategory = true;
    if (selectedCategory === "Featured") {
      matchesCategory = property.isFeatured;
    } else if (selectedCategory !== "All") {
      matchesCategory = property.category === selectedCategory;
    }

    const matchesStatus = selectedStatus === "All" ||
      property.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Feature Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Want to Feature a property on our homepage?</h3>
            <p className="text-muted-foreground text-sm">Select properties below to engage more customers instantly!</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-primary bg-background/50 px-4 py-2 rounded-lg border border-primary/10">
          <Star className="w-4 h-4 fill-current" />
          <span>Select "Star" icon on cards</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="page-header">Properties</h1>
          <p className="text-muted-foreground mt-2">
            Manage your property listings ({loading ? '...' : filteredProperties.length} properties)
          </p>
        </div>
        <Link to="/admin/properties/new">
          <Button className="gap-2 shadow-glow">
            <PlusCircle className="w-4 h-4" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 animate-fade-up stagger-1">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "whitespace-nowrap transition-all",
                selectedCategory === category && "shadow-glow"
              )}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {statuses.slice(0, 3).map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedStatus(status)}
              className="whitespace-nowrap"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 border border-border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="px-2"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="px-2"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      ) : (
        /* Properties Grid */
        <div className={cn(
          "grid gap-6",
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1"
        )}>
          {filteredProperties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              delay={0.1 + index * 0.05}
              onToggleFeature={handleToggleFeature}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProperties.length === 0 && (
        <div className="text-center py-16 animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filters
          </p>
          <Button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedStatus("All"); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
