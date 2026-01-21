import { Building2, MapPin, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const properties = [
  {
    id: 1,
    title: "Luxury Downtown Apartment",
    address: "123 Main Street, NYC",
    price: 3500,
    status: "available",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Modern Studio Loft",
    address: "456 Oak Avenue, LA",
    price: 2200,
    status: "occupied",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Beachfront Villa",
    address: "789 Ocean Drive, Miami",
    price: 5800,
    status: "available",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Cozy Mountain Cabin",
    address: "321 Pine Road, Denver",
    price: 1800,
    status: "maintenance",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
  },
];

const statusStyles = {
  available: "bg-success/10 text-success",
  occupied: "bg-accent/10 text-accent",
  maintenance: "bg-muted text-muted-foreground",
};

export function RecentProperties() {
  return (
    <div className="stat-card animate-fade-up stagger-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="section-title">Recent Properties</h3>
          <p className="text-sm text-muted-foreground mt-1">Latest property listings</p>
        </div>
        <Link 
          to="/properties"
          className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors group"
        >
          View all
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {properties.map((property, index) => (
          <Link
            key={property.id}
            to={`/properties/${property.id}`}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group"
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <img 
                src={property.image} 
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate group-hover:text-accent transition-colors">
                {property.title}
              </h4>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{property.address}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="font-semibold text-foreground">${property.price.toLocaleString()}/mo</span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
                statusStyles[property.status as keyof typeof statusStyles]
              )}>
                {property.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
