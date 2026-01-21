import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Bed, Bath, Square, Calendar, Check, Share2, Heart, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function PropertyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        async function fetchProperty() {
            if (!id) return;

            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data) {
                    // Map DB snake_case to camelCase
                    setProperty({
                        ...data,
                        zipCode: data.zip_code,
                        promotionalPrice: data.promotional_price,
                        availableFrom: data.available_from,
                        isFeatured: data.is_featured,
                        includedUtilities: data.included_utilities,
                        // Ensure images is an array
                        images: data.images && data.images.length > 0 ? data.images : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"]
                    });
                }
            } catch (error: any) {
                console.error('Error fetching property:', error);
                toast({
                    title: "Error",
                    description: "Could not load property details.",
                    variant: "destructive",
                });
                navigate("/properties");
            } finally {
                setLoading(false);
            }
        }

        fetchProperty();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                <p className="text-muted-foreground">Loading property details...</p>
            </div>
        );
    }

    if (!property) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" className="gap-2" onClick={() => navigate("/properties")}>
                    <ArrowLeft className="w-4 h-4" />
                    Back to Properties
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                        <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Heart className="w-4 h-4" />
                    </Button>
                    <Button className="gap-2 bg-accent hover:bg-accent/90">
                        <Edit className="w-4 h-4" />
                        Edit
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column - Images & Details */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-video relative rounded-2xl overflow-hidden border border-border shadow-md transition-all">
                            <img
                                src={property.images[activeImage]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4">
                                <Badge variant={
                                    property.status === 'available' ? 'default' :
                                        property.status === 'occupied' ? 'secondary' : 'outline'
                                } className="uppercase tracking-wider">
                                    {property.status}
                                </Badge>
                            </div>
                        </div>
                        {property.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {property.images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-accent shadow-glow' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Property Info Header */}
                    <div>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-foreground">{property.title}</h1>
                                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                    <MapPin className="w-4 h-4 text-accent" />
                                    <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                {property.promotionalPrice && property.promotionalPrice < property.price ? (
                                    <div className="space-y-1">
                                        <div className="text-3xl font-bold text-accent">${property.promotionalPrice.toLocaleString()}</div>
                                        <div className="text-sm text-muted-foreground line-through">${property.price.toLocaleString()}</div>
                                    </div>
                                ) : (
                                    <div className="text-3xl font-bold text-foreground">${property.price.toLocaleString()}</div>
                                )}
                                <div className="text-sm text-muted-foreground">per month</div>
                            </div>
                        </div>

                        {/* Key Stats */}
                        <div className="grid grid-cols-4 gap-4 mt-8 p-6 bg-card rounded-xl border border-border">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <Bed className="w-6 h-6 text-accent" />
                                <span className="font-semibold">{property.bedrooms} Beds</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center border-l border-border">
                                <Bath className="w-6 h-6 text-accent" />
                                <span className="font-semibold">{property.bathrooms} Baths</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center border-l border-border">
                                <Square className="w-6 h-6 text-accent" />
                                <span className="font-semibold">{property.sqft} sqft</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center border-l border-border">
                                <Calendar className="w-6 h-6 text-accent" />
                                <span className="font-semibold text-sm">Avail: {new Date(property.availableFrom).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">About this property</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {property.description}
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Features & Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                            {property.features?.map((feature: string, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-accent" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions Card */}
                    <div className="bg-card rounded-xl border border-border p-6 shadow-sm sticky top-6">
                        <h3 className="font-semibold mb-4">Property Management</h3>
                        <div className="space-y-3">
                            <Button className="w-full justify-between" variant="outline">
                                <span>Manage Tenants</span>
                                <span className="bg-muted px-2 py-0.5 rounded-full text-xs">0 Active</span>
                            </Button>
                            <Button className="w-full justify-between" variant="outline">
                                <span>Maintenance Requests</span>
                                <span className="bg-muted px-2 py-0.5 rounded-full text-xs">0 Pending</span>
                            </Button>
                            <Button className="w-full justify-between" variant="outline">
                                <span>Payment History</span>
                            </Button>

                            <div className="h-px bg-border my-4" />

                            <div className="space-y-2">
                                <p className="text-sm font-medium">Included Utilities</p>
                                <div className="flex flex-wrap gap-2">
                                    {property.includedUtilities?.map((u: string) => (
                                        <Badge key={u} variant="secondary" className="font-normal">{u}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
