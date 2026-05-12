import { cars } from '../src/lib/data';
import { writeFileSync } from 'fs';

const SELLER_ID = '940cfe48-e958-4104-bb81-3799668e3c38';

const listings = cars.map(car => ({
  seller_id: SELLER_ID,
  slug: car.id,
  make: car.make,
  model: car.model,
  year: car.year,
  price: car.price,
  mileage: car.mileage,
  description: car.description,
  short_description: car.shortDescription,
  condition: car.condition,
  location: car.location,
  engine: car.specs?.engine || null,
  transmission: car.specs?.transmission || null,
  drivetrain: car.specs?.drivetrain || null,
  exterior_color: car.specs?.exteriorColor || null,
  interior_color: car.specs?.interiorColor || null,
  body_type: car.specs?.bodyType || null,
  features: car.features || [],
  is_featured: car.featured || false,
  status: car.status === 'sold' ? 'sold' : 'approved',
  views_count: Math.floor(Math.random() * 500) + 50,
  contacts_count: Math.floor(Math.random() * 20),
  paid_at: new Date(car.createdAt).toISOString(),
  approved_at: new Date(car.createdAt).toISOString(),
}));

const images: {listing_slug: string; url: string; sort_order: number; is_primary: boolean}[] = [];
cars.forEach(car => {
  (car.images || []).forEach((url: string, j: number) => {
    images.push({ listing_slug: car.id, url, sort_order: j, is_primary: j === 0 });
  });
});

writeFileSync('/tmp/listings.json', JSON.stringify(listings));
writeFileSync('/tmp/images.json', JSON.stringify(images));
console.log(listings.length + ' listings, ' + images.length + ' images');
