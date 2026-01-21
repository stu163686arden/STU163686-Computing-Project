export interface Property {
  id: string;
  title: string;
  location: string;
  address: string;
  price: number;
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  available: boolean;
  description: string;
  features: string[];
  utilities: string[];
  terms: string;
  moveInDate: string;
  deposit: number;
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Modern Studio Apartment",
    location: "Observatory, Cape Town",
    address: "15 Station Road, Observatory, Cape Town 7925",
    price: 6500,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop",
    ],
    beds: 1,
    baths: 1,
    sqft: 35,
    available: true,
    description:
      "A beautifully designed modern studio apartment perfect for students. Located just 5 minutes walk from UCT and close to all amenities. The space features contemporary finishes, large windows for natural light, and a fully equipped kitchenette.",
    features: [
      "High-speed WiFi",
      "Built-in wardrobe",
      "Study desk",
      "Air conditioning",
      "24/7 Security",
      "Laundry facilities",
      "Bike storage",
      "Communal garden",
    ],
    utilities: ["Water included", "Electricity (prepaid)", "WiFi 100Mbps", "Weekly cleaning"],
    terms: "11-month lease, 1 month deposit required",
    moveInDate: "1 February 2024",
    deposit: 6500,
  },
  {
    id: "2",
    title: "Shared Double Room",
    location: "Rondebosch, Cape Town",
    address: "42 Main Road, Rondebosch, Cape Town 7700",
    price: 4500,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
    ],
    beds: 1,
    baths: 1,
    sqft: 28,
    available: true,
    description:
      "A comfortable shared room in a vibrant student house. Perfect for those looking to make friends and save on rent. Shared common areas include a modern kitchen, lounge, and outdoor patio.",
    features: [
      "Shared kitchen",
      "Common lounge",
      "Study area",
      "Fiber WiFi",
      "Secure parking",
      "CCTV cameras",
      "Outdoor patio",
      "BBQ area",
    ],
    utilities: ["All utilities included", "WiFi 50Mbps", "DStv access"],
    terms: "6 or 12-month lease options",
    moveInDate: "Immediately",
    deposit: 4500,
  },
  {
    id: "3",
    title: "Premium 2-Bed Apartment",
    location: "Stellenbosch Central",
    address: "88 Dorp Street, Stellenbosch 7600",
    price: 12000,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&auto=format&fit=crop",
    ],
    beds: 2,
    baths: 2,
    sqft: 75,
    available: true,
    description:
      "Luxurious 2-bedroom apartment in the heart of Stellenbosch. Walking distance to Stellenbosch University. Features include a balcony with mountain views, modern appliances, and premium finishes throughout.",
    features: [
      "Mountain views",
      "Balcony",
      "Dishwasher",
      "Washing machine",
      "Gym access",
      "Pool",
      "Concierge",
      "Undercover parking",
    ],
    utilities: ["Electricity prepaid", "Water included", "WiFi 200Mbps", "Gym & pool access"],
    terms: "12-month lease minimum",
    moveInDate: "1 March 2024",
    deposit: 24000,
  },
  {
    id: "4",
    title: "Cozy Bachelor Flat",
    location: "Hatfield, Pretoria",
    address: "23 Burnett Street, Hatfield, Pretoria 0083",
    price: 5200,
    images: [
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop",
    ],
    beds: 1,
    baths: 1,
    sqft: 32,
    available: false,
    description:
      "A cozy bachelor flat ideal for focused students. Located in the heart of Hatfield, close to the University of Pretoria. The space is compact but thoughtfully designed with everything you need.",
    features: [
      "Compact kitchen",
      "Study nook",
      "Air conditioning",
      "Secure complex",
      "Visitor parking",
      "Garden area",
    ],
    utilities: ["Electricity included (cap)", "Water included", "WiFi available"],
    terms: "Semester or annual lease",
    moveInDate: "Waitlist",
    deposit: 5200,
  },
  {
    id: "5",
    title: "Luxury Penthouse Suite",
    location: "Sea Point, Cape Town",
    address: "100 Beach Road, Sea Point, Cape Town 8005",
    price: 18500,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
    ],
    beds: 3,
    baths: 2,
    sqft: 120,
    available: true,
    description:
      "Stunning penthouse with panoramic ocean views. Perfect for a group of postgraduate students or young professionals. Features include a private rooftop terrace, high-end appliances, and designer interiors.",
    features: [
      "Ocean views",
      "Rooftop terrace",
      "Smart home system",
      "Wine fridge",
      "Private gym",
      "2x Parking bays",
      "Concierge service",
      "Pet friendly",
    ],
    utilities: ["All utilities separate", "Fiber 500Mbps available", "Building services included"],
    terms: "12-month lease, 2 months deposit",
    moveInDate: "1 April 2024",
    deposit: 37000,
  },
  {
    id: "6",
    title: "Student Pod Room",
    location: "Braamfontein, Johannesburg",
    address: "55 Jorissen Street, Braamfontein, Johannesburg 2001",
    price: 3800,
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&auto=format&fit=crop",
    ],
    beds: 1,
    baths: 1,
    sqft: 18,
    available: true,
    description:
      "Modern pod-style accommodation designed for the budget-conscious student. Includes access to shared amenities, study lounges, and a vibrant community of fellow students from Wits University.",
    features: [
      "Pod bed with storage",
      "Shared bathrooms",
      "Study lounges",
      "Games room",
      "Rooftop hangout",
      "24/7 access",
    ],
    utilities: ["All inclusive", "Uncapped WiFi", "Cleaning services", "DSTV in common areas"],
    terms: "Monthly or annual options",
    moveInDate: "Immediately",
    deposit: 3800,
  },
];
