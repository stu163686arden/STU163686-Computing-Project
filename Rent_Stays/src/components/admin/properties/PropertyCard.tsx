import { MapPin, Bed, Bath, Square, Calendar, Edit, Trash2, Eye, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: {
    id: string | number;
    title: string;
    slug: string;
    address: string;
    price: number;
    promotionalPrice?: number;
    status: string;
    category: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    availableFrom: string;
    image: string;
    isFeatured?: boolean;
  };
  delay?: number;
  onToggleFeature?: (id: string, currentStatus: boolean) => void;
  onDelete?: (id: string) => void;
}

const statusStyles = {
  available: "bg-success/10 text-success border-success/20",
  occupied: "bg-accent/10 text-accent border-accent/20",
  maintenance: "bg-muted text-muted-foreground border-border",
  reserved: "bg-primary/10 text-primary border-primary/20",
};

export function PropertyCard({ property, delay = 0, onToggleFeature, onDelete }: PropertyCardProps) {
  const hasPromo = property.promotionalPrice && property.promotionalPrice < property.price;

  return (
    <div
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-up relative"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured Toggle Button */}
        <Button
          size="icon"
          variant="secondary"
          className={cn(
            "absolute top-3 right-3 z-20 h-8 w-8 rounded-full shadow-md transition-all duration-300",
            property.isFeatured
              ? "bg-yellow-400 text-white hover:bg-yellow-500 border-none"
              : "bg-white/80 hover:bg-white text-gray-400 hover:text-yellow-400"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFeature?.(String(property.id), !!property.isFeatured);
          }}
          title={property.isFeatured ? "Remove from Featured" : "Add to Featured"}
        >
          <Star className={cn("w-4 h-4", property.isFeatured && "fill-current")} />
        </Button>

        {/* Status Badge */}
        <div className={cn(
          "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium border capitalize",
          statusStyles[property.status as keyof typeof statusStyles]
        )}>
          {property.status}
        </div>

        {/* Category Badge - Repositioned slightly lower or removed if clashing, here moved down */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-card/90 backdrop-blur-sm border border-border">
          {property.category}
        </div>

        {/* Hover Actions */}
        <div className="absolute bottom-3 left-3 right-auto flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Link to={`/admin/properties/${property.id}/edit`}>
            <Button size="sm" variant="secondary" className="h-8 px-2 bg-card/90 backdrop-blur-sm hover:bg-card">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 px-2 bg-card/90 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.(property.id.toString());
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <Link to={`/admin/properties/${property.id}/edit`}>
          <h3 className="font-display text-lg font-semibold text-foreground hover:text-accent transition-colors line-clamp-1">
            {property.title}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{property.address}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{property.sqft}</span>
          </div>
        </div>

        {/* Price & Date */}
        <div className="flex items-end justify-between mt-4 pt-4 border-t border-border">
          <div>
            {hasPromo ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-display font-bold text-accent">
                  £{property.promotionalPrice?.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  £{property.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-display font-bold text-foreground">
                £{property.price.toLocaleString()}
              </span>
            )}
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{property.availableFrom}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
