import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Save,
  Image as ImageIcon,
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const categories = ["Apartment", "Loft", "Villa", "Cabin", "Penthouse", "Townhouse", "Studio", "Condo"];
const features = [
  "Air Conditioning", "Heating", "Parking", "Pool", "Gym", "Balcony",
  "Washer/Dryer", "Dishwasher", "Pet Friendly", "Furnished", "Hardwood Floors",
  "Fireplace", "Storage", "Elevator", "Doorman", "Rooftop Access"
];
const utilities = ["Water", "Electricity", "Gas", "Internet", "Cable", "Trash"];

export default function NewProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [includedUtilities, setIncludedUtilities] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    price: "",
    promotionalPrice: "",
    category: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    availableFrom: "",
    isFeatured: false,
  });

  const handleTitleChange = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({ ...formData, title: value, slug });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      setImages([...images, data.publicUrl]);
      toast({
        title: "Image Uploaded",
        description: "Image successfully added.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      // Reset input value to allow selecting same file again
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const toggleUtility = (utility: string) => {
    setIncludedUtilities(prev =>
      prev.includes(utility)
        ? prev.filter(u => u !== utility)
        : [...prev, utility]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to create a property');
      }

      // Prepare data for Supabase
      const propertyData = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode, // Note snake_case for DB
        price: parseFloat(formData.price),
        promotional_price: formData.promotionalPrice ? parseFloat(formData.promotionalPrice) : null,
        category: formData.category,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        sqft: parseInt(formData.sqft),
        available_from: formData.availableFrom,
        is_featured: formData.isFeatured,
        features: selectedFeatures,
        included_utilities: includedUtilities,
        images: images,
        status: 'available', // Default status
        owner_id: user.id  // Set the owner to the current user
      };

      const { error } = await supabase
        .from('properties')
        .insert([propertyData]);

      if (error) throw error;

      toast({
        title: "Property Created!",
        description: "Your new property listing has been saved successfully.",
      });
      navigate("/admin/properties");
    } catch (error: any) {
      console.error('Error creating property:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 animate-fade-up">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="page-header">Add New Property</h1>
          <p className="text-muted-foreground mt-1">Create a new property listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <div className="stat-card animate-fade-up stagger-1">
          <h2 className="section-title mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-accent" />
            Property Images
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border">
                <img src={image} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                    Cover
                  </span>
                )}
              </div>
            ))}

            <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-all relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={loading}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Upload className="w-6 h-6" />
                <span className="text-sm font-medium">
                  {loading ? 'Uploading...' : 'Upload Image'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="stat-card animate-fade-up stagger-2">
          <h2 className="section-title mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Luxury Downtown Apartment"
                className="mt-2"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="luxury-downtown-apartment"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Auto-generated from title. You can customize it.
              </p>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the property, its features, and what makes it special..."
                className="mt-2 min-h-[120px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="availableFrom">Available From *</Label>
              <Input
                id="availableFrom"
                type="date"
                value={formData.availableFrom}
                onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                className="mt-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="stat-card animate-fade-up stagger-3">
          <h2 className="section-title mb-6">Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main Street"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="New York"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="NY"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="10001"
                className="mt-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="stat-card animate-fade-up stagger-4">
          <h2 className="section-title mb-6">Pricing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="price">Monthly Rent *</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="3500"
                  className="pl-8"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="promotionalPrice">Promotional Price</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="promotionalPrice"
                  type="number"
                  value={formData.promotionalPrice}
                  onChange={(e) => setFormData({ ...formData, promotionalPrice: e.target.value })}
                  placeholder="3200"
                  className="pl-8"
                  min="0"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty if no promotion
              </p>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="stat-card animate-fade-up stagger-5">
          <h2 className="section-title mb-6">Property Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                placeholder="2"
                className="mt-2"
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                placeholder="2"
                className="mt-2"
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="sqft">Square Feet *</Label>
              <Input
                id="sqft"
                type="number"
                value={formData.sqft}
                onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                placeholder="1200"
                className="mt-2"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="stat-card animate-fade-up stagger-5">
          <h2 className="section-title mb-6">Features & Amenities</h2>

          <div className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedFeatures.includes(feature)
                    ? "bg-accent text-accent-foreground shadow-glow"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>

        {/* Utilities */}
        <div className="stat-card animate-fade-up stagger-6">
          <h2 className="section-title mb-6">Included Utilities</h2>

          <div className="flex flex-wrap gap-2">
            {utilities.map((utility) => (
              <button
                key={utility}
                type="button"
                onClick={() => toggleUtility(utility)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  includedUtilities.includes(utility)
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {utility}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="stat-card animate-fade-up stagger-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-title">Featured Property</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Display this property prominently on the homepage
              </p>
            </div>
            <Switch
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4 animate-fade-up stagger-6">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2 shadow-glow" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Property
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
