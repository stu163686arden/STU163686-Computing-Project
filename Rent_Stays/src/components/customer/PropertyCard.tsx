import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Square, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  id: string;
  title: string;
  slug: string; // Added slug
  location: string;
  price: number;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  available: boolean;
  index?: number;
}

const PropertyCard = ({
  id,
  title,
  slug, // Destructure slug
  location,
  price,
  image,
  beds,
  baths,
  sqft,
  available,
  index = 0,
}: PropertyCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/property/${slug}`} className="block group">
        <div className="glass-card rounded-xl overflow-hidden card-shadow hover:glow-shadow transition-all duration-500">
          {/* Image */}
          <div className="relative overflow-hidden aspect-[4/3]">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

            {/* Badge */}
            <div className="absolute top-4 left-4">
              <Badge
                variant={available ? "default" : "secondary"}
                className={available ? "bg-primary text-primary-foreground" : ""}
              >
                {available ? "Available" : "Occupied"}
              </Badge>
            </div>

            {/* Price */}
            <div className="absolute bottom-4 left-4">
              <p className="text-2xl font-bold">
                £{price.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>

            <div className="flex items-center gap-1 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location}</span>
            </div>

            {/* Features */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{beds} Bed</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{baths} Bath</span>
              </div>
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span>{sqft} m²</span>
              </div>
              <Wifi className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
