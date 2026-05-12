import type { Car } from "./types";

export const cars: Car[] = [
  {
    id: "porsche-911-carrera-rs-1973",
    make: "Porsche",
    model: "911 Carrera RS 2.7",
    year: 1973,
    price: 178000,
    mileage: 74200,
    location: "Stuttgart, Germany",
    description:
      "Matching-numbers 1973 Carrera RS 2.7 in Grand Prix White with Viper Green accents. Extensively documented ownership history with Porsche Certificate of Authenticity. Engine rebuilt by marque specialist in 2019 with less than 5,000 km since.",
    shortDescription:
      "Matching-numbers RS 2.7 in iconic white/green livery with full history.",
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
    ],
    seller: {
      name: "Klassik Automobil Stuttgart",
      email: "info@klassik-stuttgart.de",
      phone: "+49 711 555 0101",
    },
    specs: {
      engine: "2.7L Flat-6",
      transmission: "5-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Grand Prix White",
      interiorColor: "Black Leatherette",
      bodyType: "Coupe",
    },
    features: [
      "Ducktail spoiler",
      "Lightweight body panels",
      "Sport seats",
      "Fuchs alloy wheels",
      "Certificate of Authenticity",
    ],
    condition: "excellent",
    featured: true,
    createdAt: "2026-04-15",
  },
  {
    id: "porsche-911-turbo-1987",
    make: "Porsche",
    model: "911 Turbo (930)",
    year: 1987,
    price: 125000,
    mileage: 61400,
    location: "Zurich, Switzerland",
    description:
      "Late-production 930 Turbo in Guards Red over black leather. Factory-optioned with Sport seats, limited-slip differential, and electric sunroof. Full service history from Porsche Centre Zurich since 1994. Exceptionally well-preserved example.",
    shortDescription:
      "Guards Red 930 Turbo with factory sport seats and full Swiss service history.",
    images: [
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    ],
    seller: {
      name: "Prestige Motors AG",
      email: "sales@prestige-motors.ch",
      phone: "+41 44 555 0202",
    },
    specs: {
      engine: "3.3L Turbocharged Flat-6",
      transmission: "4-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Guards Red",
      interiorColor: "Black Leather",
      bodyType: "Coupe",
    },
    features: [
      "Turbo whale tail",
      "Sport seats",
      "Limited-slip differential",
      "Electric sunroof",
      "Blaupunkt radio",
    ],
    condition: "excellent",
    featured: true,
    createdAt: "2026-04-20",
  },
  {
    id: "porsche-911-993-1994",
    make: "Porsche",
    model: "911 Carrera (993)",
    year: 1994,
    price: 89000,
    mileage: 112000,
    location: "Munich, Germany",
    description:
      "The last air-cooled 911 in Midnight Blue Metallic. Two owners from new, both in Bavaria. Recently serviced with new clutch and full brake overhaul. Interior shows minimal wear with original carpets and dashboard.",
    shortDescription:
      "Last of the air-cooled 911s in Midnight Blue, two-owner Bavarian car.",
    images: [
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800&q=80",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    ],
    seller: {
      name: "Hans Muller",
      email: "hans.muller@email.de",
    },
    specs: {
      engine: "3.6L Flat-6",
      transmission: "6-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Midnight Blue Metallic",
      interiorColor: "Grey Leather",
      bodyType: "Coupe",
    },
    features: [
      "Multi-link rear suspension",
      "Power seats",
      "Cruise control",
      "16-inch Cup wheels",
      "Rear wiper",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-05-01",
  },
  {
    id: "bmw-e30-m3-1989",
    make: "BMW",
    model: "E30 M3",
    year: 1989,
    price: 95000,
    mileage: 142000,
    location: "Munich, Germany",
    description:
      "Iconic E30 M3 in Alpine White with Anthracite cloth interior. European-delivery car with dogleg gearbox. Engine produces 200 hp from the legendary S14 four-cylinder. All service records from BMW dealership network since new.",
    shortDescription:
      "Alpine White E30 M3 with dogleg box and complete BMW dealer records.",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    ],
    seller: {
      name: "Bavarian Classics GmbH",
      email: "info@bavarian-classics.de",
      phone: "+49 89 555 0303",
    },
    specs: {
      engine: "2.3L S14 Inline-4",
      transmission: "5-Speed Manual (Dogleg)",
      drivetrain: "RWD",
      exteriorColor: "Alpine White",
      interiorColor: "Anthracite Cloth",
      bodyType: "Coupe",
    },
    features: [
      "Sport suspension",
      "Box flares",
      "Rear spoiler",
      "Limited-slip differential",
      "BBS wheels",
    ],
    condition: "good",
    featured: true,
    createdAt: "2026-04-10",
  },
  {
    id: "bmw-2002-turbo-1974",
    make: "BMW",
    model: "2002 Turbo",
    year: 1974,
    price: 145000,
    mileage: 68000,
    location: "Amsterdam, Netherlands",
    description:
      "One of only 1,672 produced, this 2002 Turbo features the iconic reversed turbo script on the front spoiler. Polaris Silver with red and black interior. Fully restored in 2018 by a renowned Dutch specialist to concours-level condition.",
    shortDescription:
      "Rare 2002 Turbo, one of 1,672 built, concours-restored in 2018.",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
    ],
    seller: {
      name: "De Klassieker BV",
      email: "info@deklassieker.nl",
      phone: "+31 20 555 0404",
    },
    specs: {
      engine: "2.0L Turbocharged Inline-4",
      transmission: "4-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Polaris Silver",
      interiorColor: "Red/Black",
      bodyType: "Sedan",
    },
    features: [
      "KKK turbocharger",
      "Front spoiler with turbo script",
      "Sport seats",
      "Rear spoiler",
      "Period-correct Blaupunkt radio",
    ],
    condition: "excellent",
    featured: false,
    createdAt: "2026-03-28",
  },
  {
    id: "bmw-e46-m3-2003",
    make: "BMW",
    model: "E46 M3",
    year: 2003,
    price: 38000,
    mileage: 98000,
    location: "Barcelona, Spain",
    description:
      "E46 M3 in Imola Red with Cinnamon leather. Six-speed manual with the sublime S54 inline-six. SMG delete car from factory. Subframe reinforced in 2021. Rod bearings replaced at 85,000 km. Ready to enjoy.",
    shortDescription:
      "Imola Red E46 M3, six-speed manual, subframe reinforced and rod bearings done.",
    images: [
      "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    ],
    seller: {
      name: "Carlos Fernandez",
      email: "carlos.f@email.es",
      phone: "+34 93 555 0505",
    },
    specs: {
      engine: "3.2L S54 Inline-6",
      transmission: "6-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Imola Red",
      interiorColor: "Cinnamon Leather",
      bodyType: "Coupe",
    },
    features: [
      "19-inch CSL-style wheels",
      "Harman Kardon audio",
      "Xenon headlights",
      "Park Distance Control",
      "Subframe reinforcement",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-05-05",
  },
  {
    id: "mercedes-w113-pagoda-1968",
    make: "Mercedes-Benz",
    model: "280 SL Pagoda",
    year: 1968,
    price: 155000,
    mileage: 52000,
    location: "Paris, France",
    description:
      "Elegant W113 Pagoda in Horizon Blue with Cream leather and matching hardtop. This California-delivery car returned to Europe in 2005 and has been meticulously maintained by a French collector. Fuel-injection engine runs flawlessly.",
    shortDescription:
      "Horizon Blue Pagoda with cream leather, California-delivery car returned to Europe.",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
    ],
    seller: {
      name: "Galerie Automobile Paris",
      email: "contact@galerie-auto.fr",
      phone: "+33 1 555 0606",
    },
    specs: {
      engine: "2.8L Inline-6",
      transmission: "4-Speed Automatic",
      drivetrain: "RWD",
      exteriorColor: "Horizon Blue",
      interiorColor: "Cream Leather",
      bodyType: "Convertible",
    },
    features: [
      "Pagoda hardtop",
      "Soft top",
      "Fuel injection",
      "Power steering",
      "Chrome bumpers",
    ],
    condition: "excellent",
    featured: true,
    createdAt: "2026-04-05",
  },
  {
    id: "mercedes-w124-e500-1994",
    make: "Mercedes-Benz",
    model: "E500 (W124)",
    year: 1994,
    price: 62000,
    mileage: 135000,
    location: "Stockholm, Sweden",
    description:
      "The Porsche-built super sedan. Midnight Blue with Parchment leather, this E500 has been a Swedish car from new. Full service book stamped by Mercedes-Benz Sweden. The 5.0L V8 delivers effortless performance in a refined package.",
    shortDescription:
      "Porsche-built E500 super sedan, single-country Swedish car from new.",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800&q=80",
    ],
    seller: {
      name: "Nordic Classics AB",
      email: "info@nordic-classics.se",
      phone: "+46 8 555 0707",
    },
    specs: {
      engine: "5.0L M119 V8",
      transmission: "4-Speed Automatic",
      drivetrain: "RWD",
      exteriorColor: "Midnight Blue",
      interiorColor: "Parchment Leather",
      bodyType: "Sedan",
    },
    features: [
      "Self-leveling rear suspension",
      "Heated seats",
      "Electric sunroof",
      "Cruise control",
      "ASR traction control",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-04-25",
  },
  {
    id: "mercedes-190e-cosworth-1990",
    make: "Mercedes-Benz",
    model: "190E 2.3-16 Cosworth",
    year: 1990,
    price: 48000,
    mileage: 108000,
    location: "Milan, Italy",
    description:
      "The Cosworth-headed compact that took on the BMW M3. Smoke Silver with Sportline recaro interior. This Italian-delivered example wears its original paint and has a comprehensive service file. A true homologation special.",
    shortDescription:
      "Smoke Silver Cosworth 190E with Sportline Recaros and original paint.",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
      "https://images.unsplash.com/photo-1533473359331-2969b6cb02e1?w=800&q=80",
    ],
    seller: {
      name: "Auto Classica Milano",
      email: "vendite@autoclassica.it",
      phone: "+39 02 555 0808",
    },
    specs: {
      engine: "2.3L Cosworth Inline-4",
      transmission: "5-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Smoke Silver",
      interiorColor: "Black Recaro Cloth",
      bodyType: "Sedan",
    },
    features: [
      "Cosworth cylinder head",
      "Recaro sport seats",
      "Body kit",
      "Limited-slip differential",
      "15-inch alloy wheels",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-05-02",
  },
  {
    id: "alfa-romeo-gtv-2000-1972",
    make: "Alfa Romeo",
    model: "GTV 2000",
    year: 1972,
    price: 52000,
    mileage: 88000,
    location: "Milan, Italy",
    description:
      "Bertone-designed GTV 2000 in Alfa Red with black vinyl interior. The twin-cam engine has been rebuilt to factory spec with Weber carburettors. Bodywork is straight with no evidence of major repairs. A wonderful example of Italian gran turismo design.",
    shortDescription:
      "Alfa Red Bertone GTV 2000 with rebuilt twin-cam and Weber carbs.",
    images: [
      "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&q=80",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
    ],
    seller: {
      name: "Officina Alfa Milano",
      email: "info@officinaalfa.it",
      phone: "+39 02 555 0909",
    },
    specs: {
      engine: "2.0L Twin-Cam Inline-4",
      transmission: "5-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Alfa Red",
      interiorColor: "Black Vinyl",
      bodyType: "Coupe",
    },
    features: [
      "Weber DCOE carburettors",
      "Jaeger instruments",
      "Chrome bumpers",
      "Wood steering wheel",
      "Giulia-derived chassis",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-04-18",
  },
  {
    id: "alfa-romeo-spider-1982",
    make: "Alfa Romeo",
    model: "Spider Veloce",
    year: 1982,
    price: 28000,
    mileage: 124000,
    location: "Barcelona, Spain",
    description:
      "Series 3 Spider Veloce in Blu Medio with tan leather. Fuel-injected model offering reliable daily-driver usability. Soft top replaced in 2023. A charming open-air Italian sports car perfect for Mediterranean coastal roads.",
    shortDescription:
      "Blu Medio Spider Veloce, fuel-injected, new soft top, Mediterranean ready.",
    images: [
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3b?w=800&q=80",
    ],
    seller: {
      name: "Mediterranean Classics",
      email: "info@med-classics.es",
    },
    specs: {
      engine: "2.0L Fuel-Injected Inline-4",
      transmission: "5-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Blu Medio",
      interiorColor: "Tan Leather",
      bodyType: "Convertible",
    },
    features: [
      "Bosch L-Jetronic injection",
      "New soft top",
      "Chrome bumpers",
      "Campagnolo wheels",
      "AM/FM cassette",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-05-08",
  },
  {
    id: "jaguar-e-type-series1-1965",
    make: "Jaguar",
    model: "E-Type Series 1 Roadster",
    year: 1965,
    price: 165000,
    mileage: 41000,
    location: "Paris, France",
    description:
      "Enzo Ferrari called it the most beautiful car ever made. This Series 1 Roadster in Opalescent Dark Blue with Biscuit leather has been professionally restored by a UK specialist. Triple SU carburettors, covered headlights, and the iconic long bonnet.",
    shortDescription:
      "Series 1 E-Type Roadster in Opalescent Dark Blue, fully restored to concours standard.",
    images: [
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
    ],
    seller: {
      name: "Heritage Motor Gallery",
      email: "gallery@heritage-motors.fr",
      phone: "+33 1 555 1010",
    },
    specs: {
      engine: "4.2L XK Inline-6",
      transmission: "4-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Opalescent Dark Blue",
      interiorColor: "Biscuit Leather",
      bodyType: "Convertible",
    },
    features: [
      "Triple SU carburettors",
      "Covered headlights",
      "Wire wheels",
      "Soft top and tonneau cover",
      "Smiths instruments",
    ],
    condition: "excellent",
    featured: true,
    createdAt: "2026-03-20",
  },
  {
    id: "vw-karmann-ghia-1969",
    make: "Volkswagen",
    model: "Karmann Ghia Coupe",
    year: 1969,
    price: 32000,
    mileage: 76000,
    location: "Amsterdam, Netherlands",
    description:
      "Ghia-designed, Karmann-built beauty on a Beetle chassis. This late Type 14 in Lotus White has been lovingly maintained by its Dutch owner for 15 years. The air-cooled flat-four runs smoothly and the body is rust-free.",
    shortDescription:
      "Lotus White Karmann Ghia, rust-free, 15 years in single Dutch ownership.",
    images: [
      "https://images.unsplash.com/photo-1533473359331-2969b6cb02e1?w=800&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
    ],
    seller: {
      name: "Jan de Vries",
      email: "jan.devries@email.nl",
    },
    specs: {
      engine: "1.6L Air-Cooled Flat-4",
      transmission: "4-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Lotus White",
      interiorColor: "Black Vinyl",
      bodyType: "Coupe",
    },
    features: [
      "Chrome bumpers",
      "Ghia badge",
      "Wolfsburg crest",
      "Period radio",
      "Spare wheel",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-04-12",
  },
  {
    id: "vw-type2-bus-1972",
    make: "Volkswagen",
    model: "Type 2 Bus (T2)",
    year: 1972,
    price: 58000,
    mileage: 95000,
    location: "Barcelona, Spain",
    description:
      "Early Bay Window T2 in two-tone Pastel White over Neptune Blue. Full camper conversion with pop-top roof, kitchenette, and fold-out bed. Engine rebuilt with larger 1,776cc kit. Perfect for European road trips along the coast.",
    shortDescription:
      "Two-tone Bay Window camper bus with pop-top and rebuilt engine.",
    images: [
      "https://images.unsplash.com/photo-1533473359331-2969b6cb02e1?w=800&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3b?w=800&q=80",
    ],
    seller: {
      name: "Surf & Classic Barcelona",
      email: "hola@surfclassic.es",
      phone: "+34 93 555 1111",
    },
    specs: {
      engine: "1.8L Air-Cooled Flat-4 (1776cc)",
      transmission: "4-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Pastel White / Neptune Blue",
      interiorColor: "Plaid Cloth",
      bodyType: "Van",
    },
    features: [
      "Pop-top roof",
      "Camper conversion",
      "Kitchenette",
      "Fold-out bed",
      "Upgraded engine",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-05-03",
  },
  {
    id: "lancia-delta-integrale-1991",
    make: "Lancia",
    model: "Delta HF Integrale Evoluzione",
    year: 1991,
    price: 82000,
    mileage: 67000,
    location: "Milan, Italy",
    description:
      "The ultimate homologation rally car. This Evo 1 in Rosso Monza has been with its current Italian owner for 12 years. The 2.0L 16-valve turbo engine produces 210 hp through all four wheels. Recent full service including cambelt and water pump.",
    shortDescription:
      "Rosso Monza Delta Integrale Evo 1, rally-bred legend with recent major service.",
    images: [
      "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    ],
    seller: {
      name: "Scuderia Classica",
      email: "info@scuderiaclassica.it",
      phone: "+39 02 555 1212",
    },
    specs: {
      engine: "2.0L 16V Turbocharged Inline-4",
      transmission: "5-Speed Manual",
      drivetrain: "AWD",
      exteriorColor: "Rosso Monza",
      interiorColor: "Black Alcantara",
      bodyType: "Hatchback",
    },
    features: [
      "Permanent AWD",
      "Torsen differentials",
      "Recaro seats",
      "Martini graphics available",
      "Rally heritage",
    ],
    condition: "good",
    featured: true,
    createdAt: "2026-04-08",
  },
  {
    id: "fiat-124-spider-1978",
    make: "Fiat",
    model: "124 Spider",
    year: 1978,
    price: 22000,
    mileage: 101000,
    location: "Barcelona, Spain",
    description:
      "Pininfarina-designed open-top sports car in Giallo Positano with black interior. The twin-cam engine starts on the button and revs freely. Bodywork has been repainted in its original colour five years ago. Wonderful affordable classic motoring.",
    shortDescription:
      "Giallo Positano 124 Spider, Pininfarina design, repainted in original colour.",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3b?w=800&q=80",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
    ],
    seller: {
      name: "Pablo Ruiz",
      email: "pablo.ruiz@email.es",
    },
    specs: {
      engine: "2.0L Twin-Cam Inline-4",
      transmission: "5-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Giallo Positano",
      interiorColor: "Black Vinyl",
      bodyType: "Convertible",
    },
    features: [
      "Pininfarina bodywork",
      "Twin-cam engine",
      "Soft top",
      "Chrome bumpers",
      "Wood-rimmed steering wheel",
    ],
    condition: "fair",
    featured: false,
    createdAt: "2026-05-06",
  },
  {
    id: "volvo-p1800-1966",
    make: "Volvo",
    model: "P1800 S",
    year: 1966,
    price: 45000,
    mileage: 132000,
    location: "Stockholm, Sweden",
    description:
      "The Saint's car of choice. This P1800 S in Pearl White has a Swedish delivery history going back to its first owner. The B18 engine with twin SU carburettors provides spirited performance. Interior retains its original black leather and wood trim.",
    shortDescription:
      "Pearl White P1800 S, lifelong Swedish car with original leather interior.",
    images: [
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800&q=80",
    ],
    seller: {
      name: "Svensk Klassiker AB",
      email: "info@svenskklassiker.se",
      phone: "+46 8 555 1313",
    },
    specs: {
      engine: "1.8L B18 Inline-4",
      transmission: "4-Speed Manual with Overdrive",
      drivetrain: "RWD",
      exteriorColor: "Pearl White",
      interiorColor: "Black Leather",
      bodyType: "Coupe",
    },
    features: [
      "Overdrive gearbox",
      "Twin SU carburettors",
      "Chrome bumpers",
      "Wood dashboard trim",
      "Smiths instruments",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-04-22",
  },
  {
    id: "saab-900-turbo-1986",
    make: "Saab",
    model: "900 Turbo",
    year: 1986,
    price: 18000,
    mileage: 156000,
    location: "Stockholm, Sweden",
    description:
      "Classic 900 Turbo three-door in Eddy Grey Metallic. The turbocharged engine provides strong performance and the car retains its quirky Saab character. Well-maintained by Saab enthusiasts with documented service history. Swedish underdog charm.",
    shortDescription:
      "Eddy Grey 900 Turbo three-door, enthusiast-maintained Saab classic.",
    images: [
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800&q=80",
      "https://images.unsplash.com/photo-1533473359331-2969b6cb02e1?w=800&q=80",
    ],
    seller: {
      name: "Erik Johansson",
      email: "erik.j@email.se",
    },
    specs: {
      engine: "2.0L Turbocharged Inline-4",
      transmission: "5-Speed Manual",
      drivetrain: "FWD",
      exteriorColor: "Eddy Grey Metallic",
      interiorColor: "Tan Velour",
      bodyType: "Hatchback",
    },
    features: [
      "Garrett turbocharger",
      "Heated seats",
      "Ignition between seats",
      "Wraparound windshield",
      "Roof rails",
    ],
    condition: "fair",
    featured: false,
    createdAt: "2026-05-07",
  },
  {
    id: "ferrari-308-gts-1979",
    make: "Ferrari",
    model: "308 GTS",
    year: 1979,
    price: 98000,
    mileage: 54000,
    location: "Zurich, Switzerland",
    description:
      "Pininfarina-designed V8 targa in Rosso Corsa with tan leather. Carburetted model with the more characterful engine note. Belt service completed at 52,000 km. Accompanied by Marcel Massini history report and full tool kit in the front boot.",
    shortDescription:
      "Rosso Corsa 308 GTS, carburetted V8, Massini report, tools and books.",
    images: [
      "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&q=80",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    ],
    seller: {
      name: "Garage Suisse SA",
      email: "info@garage-suisse.ch",
      phone: "+41 44 555 1414",
    },
    specs: {
      engine: "3.0L V8",
      transmission: "5-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Rosso Corsa",
      interiorColor: "Tan Leather",
      bodyType: "Targa",
    },
    features: [
      "Targa top",
      "Weber carburettors",
      "Campagnolo wheels",
      "Massini history report",
      "Full tool kit",
    ],
    condition: "excellent",
    featured: false,
    createdAt: "2026-04-02",
  },
  {
    id: "land-rover-defender-90-1997",
    make: "Land Rover",
    model: "Defender 90 TDi",
    year: 1997,
    price: 42000,
    mileage: 178000,
    location: "Amsterdam, Netherlands",
    description:
      "Late-model Defender 90 in Coniston Green with matching hardtop. The 300TDi diesel engine is bulletproof and easy to maintain. New galvanized chassis fitted in 2022. Wolf wheels with BF Goodrich All-Terrain tyres. Ready for any adventure.",
    shortDescription:
      "Coniston Green Defender 90, galvanized chassis, BFG tyres, adventure-ready.",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3b?w=800&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    ],
    seller: {
      name: "Overland Europe BV",
      email: "info@overlandeurope.nl",
      phone: "+31 20 555 1515",
    },
    specs: {
      engine: "2.5L 300TDi Diesel Inline-4",
      transmission: "5-Speed Manual",
      drivetrain: "4WD",
      exteriorColor: "Coniston Green",
      interiorColor: "Grey Cloth",
      bodyType: "SUV",
    },
    features: [
      "Galvanized chassis",
      "Wolf wheels",
      "BF Goodrich tyres",
      "Snorkel",
      "Heavy-duty winch bumper",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-05-09",
  },
  {
    id: "porsche-356-speedster-1957",
    make: "Porsche",
    model: "356A Speedster",
    year: 1957,
    price: 175000,
    mileage: 39000,
    location: "Zurich, Switzerland",
    description:
      "Pre-A Speedster in Silver Metallic with red leather. Matching-numbers car with CoA from Porsche. The low-slung windshield, bucket seats, and side curtains define the purest sports car experience. Extensively documented provenance.",
    shortDescription:
      "Matching-numbers 356A Speedster in Silver with red leather and Porsche CoA.",
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
    ],
    seller: {
      name: "Prestige Motors AG",
      email: "sales@prestige-motors.ch",
      phone: "+41 44 555 0202",
    },
    specs: {
      engine: "1.6L Flat-4",
      transmission: "4-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Silver Metallic",
      interiorColor: "Red Leather",
      bodyType: "Convertible",
    },
    features: [
      "Low-cut windshield",
      "Bucket seats",
      "Side curtains",
      "Chrome wheels",
      "Certificate of Authenticity",
    ],
    condition: "excellent",
    featured: false,
    createdAt: "2026-03-15",
  },
  {
    id: "bmw-e9-3-0-csl-1973",
    make: "BMW",
    model: "3.0 CSL",
    year: 1973,
    price: 168000,
    mileage: 58000,
    location: "Munich, Germany",
    description:
      "The Batmobile. Chamonix White with black interior, this 3.0 CSL retains its original aerodynamic package including the iconic rear wing. Lightweight aluminium body panels and the fuel-injected M30 engine make this a true homologation racer for the road.",
    shortDescription:
      "Chamonix White 3.0 CSL Batmobile with original aero kit and lightweight panels.",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
    ],
    seller: {
      name: "Bavarian Classics GmbH",
      email: "info@bavarian-classics.de",
      phone: "+49 89 555 0303",
    },
    specs: {
      engine: "3.0L M30 Inline-6",
      transmission: "4-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Chamonix White",
      interiorColor: "Black Cloth",
      bodyType: "Coupe",
    },
    features: [
      "Aerodynamic body kit",
      "Aluminium panels",
      "Rear wing",
      "Front splitter",
      "Lightweight construction",
    ],
    condition: "excellent",
    featured: false,
    createdAt: "2026-03-25",
  },
  {
    id: "citroen-ds-21-pallas-1970",
    make: "Citroen",
    model: "DS 21 Pallas",
    year: 1970,
    price: 56000,
    mileage: 89000,
    location: "Paris, France",
    description:
      "The goddess of French automotive design. This DS 21 Pallas in Brun Scarabee with leather interior rides on its legendary hydropneumatic suspension. Fully serviced hydraulic system ensures the magical ride quality the DS is celebrated for.",
    shortDescription:
      "Brun Scarabee DS 21 Pallas with serviced hydropneumatic suspension.",
    images: [
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3b?w=800&q=80",
    ],
    seller: {
      name: "Garage Citroen Classique",
      email: "contact@citroen-classique.fr",
      phone: "+33 1 555 1616",
    },
    specs: {
      engine: "2.2L Inline-4",
      transmission: "4-Speed Semi-Automatic",
      drivetrain: "FWD",
      exteriorColor: "Brun Scarabee",
      interiorColor: "Tan Leather",
      bodyType: "Sedan",
    },
    features: [
      "Hydropneumatic suspension",
      "Power steering",
      "Swiveling headlights",
      "Pallas luxury trim",
      "Semi-automatic gearbox",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-04-28",
  },
  {
    id: "ferrari-dino-246-gt-1971",
    make: "Ferrari",
    model: "Dino 246 GT",
    year: 1971,
    price: 145000,
    mileage: 47000,
    location: "Milan, Italy",
    description:
      "Named after Enzo's son, the Dino 246 GT is one of the most beautiful mid-engine designs ever penned. This Giallo Fly example with black leather has matching numbers and a Classiche certification. The V6 sings to its 7,600 rpm redline.",
    shortDescription:
      "Giallo Fly Dino 246 GT, matching numbers, Ferrari Classiche certified.",
    images: [
      "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&q=80",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
    ],
    seller: {
      name: "Auto Classica Milano",
      email: "vendite@autoclassica.it",
      phone: "+39 02 555 0808",
    },
    specs: {
      engine: "2.4L V6",
      transmission: "5-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Giallo Fly",
      interiorColor: "Black Leather",
      bodyType: "Coupe",
    },
    features: [
      "Mid-engine layout",
      "Classiche certification",
      "Borrani wire wheels",
      "Daytona-style seats",
      "Full tool roll",
    ],
    condition: "excellent",
    featured: false,
    createdAt: "2026-03-30",
  },
  {
    id: "peugeot-205-gti-1989",
    make: "Peugeot",
    model: "205 GTI 1.9",
    year: 1989,
    price: 24000,
    mileage: 118000,
    location: "Paris, France",
    description:
      "The definitive hot hatch. This 1.9-litre 205 GTI in Miami Blue is increasingly rare in unmodified condition. Original Speedline alloys, half-leather seats, and the precise chassis dynamics that set the benchmark for an entire class of car.",
    shortDescription:
      "Miami Blue 205 GTI 1.9, unmodified benchmark hot hatch with Speedline wheels.",
    images: [
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    ],
    seller: {
      name: "French Classics Auto",
      email: "contact@frenchclassics.fr",
    },
    specs: {
      engine: "1.9L Inline-4",
      transmission: "5-Speed Manual",
      drivetrain: "FWD",
      exteriorColor: "Miami Blue",
      interiorColor: "Grey Half-Leather",
      bodyType: "Hatchback",
    },
    features: [
      "Speedline alloy wheels",
      "Half-leather sport seats",
      "Sunroof",
      "Rear wiper",
      "Original radio-cassette",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-05-04",
  },
  {
    id: "aston-martin-db6-1967",
    make: "Aston Martin",
    model: "DB6 Vantage",
    year: 1967,
    price: 175000,
    mileage: 62000,
    location: "Zurich, Switzerland",
    description:
      "Grand touring at its finest. This DB6 Vantage in California Sage over Magnolia leather features the higher-output triple Weber engine producing 325 hp. Kamm tail design improves on the DB5. A gentleman's express for discerning collectors.",
    shortDescription:
      "California Sage DB6 Vantage with triple Webers and Magnolia leather.",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3b?w=800&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
    ],
    seller: {
      name: "Garage Suisse SA",
      email: "info@garage-suisse.ch",
      phone: "+41 44 555 1414",
    },
    specs: {
      engine: "4.0L Inline-6 Vantage",
      transmission: "5-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "California Sage",
      interiorColor: "Magnolia Leather",
      bodyType: "Coupe",
    },
    features: [
      "Triple Weber carburettors",
      "Kamm tail",
      "Wire wheels",
      "Power steering",
      "Wood-rimmed steering wheel",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-04-14",
  },
  {
    id: "renault-alpine-a110-1973",
    make: "Alpine",
    model: "A110 1600S",
    year: 1973,
    price: 115000,
    mileage: 43000,
    location: "Paris, France",
    description:
      "The lightweight French rally legend. This A110 1600S in Bleu Alpine wears its original fibreglass body and features the Gordini-tuned 1.6L engine. Rear-mounted engine and featherweight construction create handling that defies physics.",
    shortDescription:
      "Bleu Alpine A110 1600S, Gordini engine, rally legend in lightweight fibreglass.",
    images: [
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
    ],
    seller: {
      name: "Heritage Motor Gallery",
      email: "gallery@heritage-motors.fr",
      phone: "+33 1 555 1010",
    },
    specs: {
      engine: "1.6L Gordini Inline-4",
      transmission: "5-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Bleu Alpine",
      interiorColor: "Black Vinyl",
      bodyType: "Coupe",
    },
    features: [
      "Fibreglass body",
      "Gordini-tuned engine",
      "Lightweight tubular chassis",
      "Rally-spec suspension",
      "Lucas fog lamps",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-04-06",
  },
  {
    id: "mercedes-300sl-gullwing-1956",
    make: "Mercedes-Benz",
    model: "300 SL Gullwing",
    year: 1956,
    price: 180000,
    mileage: 28000,
    location: "Munich, Germany",
    description:
      "Perhaps the most iconic sports car of all time. This 300 SL Gullwing in Silver with red plaid interior has been in a European collection for 30 years. The Bosch fuel-injected straight-six was a technological marvel in its day and remains thrilling.",
    shortDescription:
      "Silver 300 SL Gullwing with red plaid, 30 years in European collection.",
    images: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    ],
    seller: {
      name: "Klassik Automobil Stuttgart",
      email: "info@klassik-stuttgart.de",
      phone: "+49 711 555 0101",
    },
    specs: {
      engine: "3.0L Inline-6",
      transmission: "4-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Silver",
      interiorColor: "Red Plaid",
      bodyType: "Coupe",
    },
    features: [
      "Gullwing doors",
      "Bosch mechanical fuel injection",
      "Tubular space frame",
      "Rudge knock-off wheels",
      "Fitted luggage",
    ],
    condition: "excellent",
    featured: false,
    createdAt: "2026-02-20",
  },
  {
    id: "maserati-ghibli-1968",
    make: "Maserati",
    model: "Ghibli 4.7",
    year: 1968,
    price: 135000,
    mileage: 71000,
    location: "Milan, Italy",
    description:
      "Ghia-designed grand tourer with a 4.7-litre V8 producing 330 hp. This Ghibli in Azzurro Metallizzato with Connolly leather has been part of an Italian collection and is accompanied by Maserati Classiche documentation. Long, low, and devastatingly handsome.",
    shortDescription:
      "Azzurro Metallizzato Ghibli 4.7, Ghia design, Maserati Classiche documented.",
    images: [
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
      "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&q=80",
    ],
    seller: {
      name: "Scuderia Classica",
      email: "info@scuderiaclassica.it",
      phone: "+39 02 555 1212",
    },
    specs: {
      engine: "4.7L V8",
      transmission: "5-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Azzurro Metallizzato",
      interiorColor: "Tan Connolly Leather",
      bodyType: "Coupe",
    },
    features: [
      "Ghia design",
      "Pop-up headlights",
      "Wire wheels",
      "Air conditioning",
      "Classiche documentation",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-04-16",
  },
  {
    id: "triumph-tr6-1974",
    make: "Triumph",
    model: "TR6",
    year: 1974,
    price: 26000,
    mileage: 94000,
    location: "Amsterdam, Netherlands",
    description:
      "Michelotti-designed British roadster with a torquey 2.5-litre straight-six. This Pimento Red TR6 with black leather has been in the Netherlands for 20 years. Independent rear suspension provides surprisingly good handling for its era.",
    shortDescription:
      "Pimento Red TR6, straight-six roadster, 20 years in Dutch ownership.",
    images: [
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3b?w=800&q=80",
    ],
    seller: {
      name: "British Car Corner",
      email: "info@britishcarcorner.nl",
    },
    specs: {
      engine: "2.5L Inline-6",
      transmission: "4-Speed Manual with Overdrive",
      drivetrain: "RWD",
      exteriorColor: "Pimento Red",
      interiorColor: "Black Leather",
      bodyType: "Convertible",
    },
    features: [
      "Overdrive gearbox",
      "Independent rear suspension",
      "Chrome bumpers",
      "Tonneau cover",
      "Lucas electrics",
    ],
    condition: "fair",
    featured: false,
    createdAt: "2026-05-10",
  },
  {
    id: "bmw-z8-2001",
    make: "BMW",
    model: "Z8",
    year: 2001,
    price: 165000,
    mileage: 34000,
    location: "Munich, Germany",
    description:
      "Henrik Fisker's retro-modern masterpiece paying homage to the 507. This Z8 in Titanium Silver with Crema leather has covered only 34,000 km. The S62 V8 from the M5 produces 400 hp and the aluminium body keeps weight in check. Complete with hardtop.",
    shortDescription:
      "Titanium Silver Z8 with just 34,000 km, S62 V8, hardtop included.",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800&q=80",
    ],
    seller: {
      name: "Bavarian Classics GmbH",
      email: "info@bavarian-classics.de",
      phone: "+49 89 555 0303",
    },
    specs: {
      engine: "5.0L S62 V8",
      transmission: "6-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Titanium Silver",
      interiorColor: "Crema Leather",
      bodyType: "Convertible",
    },
    features: [
      "Aluminium body",
      "Hardtop included",
      "Nappa leather",
      "Run-flat tyres",
      "Alpina-built engine",
    ],
    condition: "excellent",
    featured: false,
    createdAt: "2026-03-18",
  },
  {
    id: "fiat-500-l-1970",
    make: "Fiat",
    model: "500 L",
    year: 1970,
    price: 15000,
    mileage: 67000,
    location: "Barcelona, Spain",
    description:
      "The ultimate city car icon. This Cinquecento in Celeste Blue with blue and white vinyl interior is mechanically sorted and ready for narrow European streets. The air-cooled twin-cylinder engine sips fuel and the full-length canvas roof opens for sunshine.",
    shortDescription:
      "Celeste Blue Cinquecento 500 L, canvas roof, the ultimate city car icon.",
    images: [
      "https://images.unsplash.com/photo-1533473359331-2969b6cb02e1?w=800&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
    ],
    seller: {
      name: "Mediterranean Classics",
      email: "info@med-classics.es",
    },
    specs: {
      engine: "0.5L Air-Cooled Inline-2",
      transmission: "4-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Celeste Blue",
      interiorColor: "Blue/White Vinyl",
      bodyType: "Sedan",
    },
    features: [
      "Full-length canvas roof",
      "Suicide doors",
      "Chrome bumperettes",
      "Lusso trim",
      "Spare wheel kit",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-05-11",
  },
  {
    id: "porsche-944-turbo-1988",
    make: "Porsche",
    model: "944 Turbo S",
    year: 1988,
    price: 55000,
    mileage: 89000,
    location: "Stuttgart, Germany",
    description:
      "The 944 Turbo S was the pinnacle of the transaxle Porsche range. This Guards Red example with black leather features the uprated 250 hp engine, M030 sport suspension, and larger brakes. One of only 1,635 Turbo S models produced for 1988.",
    shortDescription:
      "Guards Red 944 Turbo S, 250 hp, M030 suspension, 1 of 1,635 built.",
    images: [
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    ],
    seller: {
      name: "Klassik Automobil Stuttgart",
      email: "info@klassik-stuttgart.de",
      phone: "+49 711 555 0101",
    },
    specs: {
      engine: "2.5L Turbocharged Inline-4",
      transmission: "5-Speed Manual",
      drivetrain: "RWD",
      exteriorColor: "Guards Red",
      interiorColor: "Black Leather",
      bodyType: "Coupe",
    },
    features: [
      "M030 sport suspension",
      "Larger turbo brakes",
      "Sport seats",
      "Limited-slip differential",
      "16-inch Club Sport wheels",
    ],
    condition: "good",
    featured: false,
    createdAt: "2026-04-30",
  },
];

export function getCarById(id: string): Car | undefined {
  return cars.find((car) => car.id === id);
}

export function getFeaturedCars(): Car[] {
  return cars.filter((car) => car.featured).slice(0, 6);
}

export function getCarMakes(): string[] {
  return [...new Set(cars.map((car) => car.make))].sort();
}

export function filterCars(params: {
  make?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  search?: string;
}): Car[] {
  return cars.filter((car) => {
    if (params.make && car.make !== params.make) return false;
    if (params.minPrice !== undefined && car.price < params.minPrice)
      return false;
    if (params.maxPrice !== undefined && car.price > params.maxPrice)
      return false;
    if (params.minYear !== undefined && car.year < params.minYear) return false;
    if (params.maxYear !== undefined && car.year > params.maxYear) return false;
    if (params.search) {
      const query = params.search.toLowerCase();
      const searchable =
        `${car.make} ${car.model} ${car.year} ${car.description} ${car.location}`.toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    return true;
  });
}
