import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar, Shield, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/data/properties";
import BookingModal from "@/components/shared/BookingModal";

interface StickyPriceCardProps {
  property: Property;
}

const StickyPriceCard = ({ property }: StickyPriceCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.1], [50, 0]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div ref={containerRef} className="h-full">
      <motion.div
        style={{ opacity, y }}
        className="sticky top-28 glass-card rounded-2xl p-6 card-shadow"
      >
        {/* Price Header */}
        <div className="mb-6 pb-6 border-b border-border">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-bold gradient-text">
              £{property.price.toLocaleString()}
            </span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Deposit: £{property.deposit.toLocaleString()}
          </p>
        </div>

        {/* Utilities */}
        <div className="mb-6 pb-6 border-b border-border">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            What's Included
          </h4>
          <ul className="space-y-2">
            {property.utilities.map((utility, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" />
                {utility}
              </li>
            ))}
          </ul>
        </div>

        {/* Terms */}
        <div className="mb-6 pb-6 border-b border-border">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Lease Terms
          </h4>
          <p className="text-sm text-muted-foreground">{property.terms}</p>
        </div>

        {/* Move-in Date */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Available From
          </h4>
          <p className="text-sm text-muted-foreground">{property.moveInDate}</p>
        </div>

        {/* CTA */}
        <Button
          className="w-full py-6 text-base font-semibold rounded-xl glow-shadow"
          onClick={() => setIsModalOpen(true)}
        >
          Apply Now
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          No application fees • Response within 24 hours
        </p>

        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyId={property.id}
          propertyTitle={property.title}
        />
      </motion.div>
    </div>
  );
};

export default StickyPriceCard;
