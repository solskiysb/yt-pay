export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  description: string;
  shortDescription: string;
  images: string[];
  seller: {
    name: string;
    email: string;
    phone?: string;
  };
  specs: {
    engine: string;
    transmission: string;
    drivetrain: string;
    exteriorColor: string;
    interiorColor: string;
    bodyType: string;
  };
  features: string[];
  condition: "excellent" | "good" | "fair";
  featured: boolean;
  createdAt: string;
}
