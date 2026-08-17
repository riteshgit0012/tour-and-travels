// Central place for business details + fallback content.
// The pages try the FastAPI backend first and fall back to this data if the
// API is unreachable — so the site always looks complete.

export const COMPANY = {
  name: "Sanatan Tour & Travels",
  shortName: "Sanatan",
  tagline: "Your trusted travel partner in Ayodhya",
  phone: "+91 9910761272",
  phoneRaw: "919910761272",
  email: "ladesar16@gmail.com",
  address: "Near Maharshi Valmiki Airport, Gurudev Palace, Ayodhya, Uttar Pradesh",
  whatsapp: "919910761272",
  hours: "Open 24 hours · All days",
  mapQuery: "Ayodhya, Uttar Pradesh",
};

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

  export const FLEET = [
    {
      id: "ertiga",
      name: "Maruti Ertiga",
      type: "7 Seater MPV",
      seats: 7,
      price_per_km: 14,
      image: "/fleet/ertiga.png",
      tag: "Family Favourite",
      features: ["7 Seats", "AC", "Extra Luggage", "Comfortable Ride"],
      description:
        "Ideal for small families and groups. A perfect blend of comfort and space for city trips or short pilgrimage journeys.",
    },
  {
    id: "wagonr",
    name: "Maruti Wagon-R",
    type: "5 Seater Hatchback",
    seats: 4,
    price_per_km: 10,
    icon: "car",
    tag: "Most Affordable",
    features: ["4 Seats", "AC", "Budget Friendly", "Easy Parking"],
    description:
      "Spacious and economical — a popular choice for individuals and small groups looking for a light on the pocket ride.",
  },
  {
    id: "glanza",
    name: "Toyota Glanza",
    type: "5 Seater Premium",
    seats: 4,
    price_per_km: 11,
    icon: "car",
    tag: "Premium",
    features: ["4 Seats", "AC", "Premium Interior", "Smooth Drive"],
    description:
      "Travel in style with the Toyota Glanza. Elegance meets performance — perfect for business travel and comfortable commutes.",
  },
  {
    id: "dzire",
    name: "Maruti Suzuki Dzire",
    type: "5 Seater Sedan",
    seats: 4,
    price_per_km: 11,
    icon: "car",
    tag: "Popular Sedan",
    features: ["4 Seats", "AC", "Boot Space", "City & Highway"],
    description:
      "A reliable and roomy sedan with generous boot space — an all-rounder for both city rides and long highway journeys.",
  },
  {
    id: "innova",
    name: "Innova Crysta",
    type: "7+1 Seater SUV",
    seats: 7,
    price_per_km: 18,
    icon: "suv",
    tag: "Luxury SUV",
    features: ["7+1 Seats", "AC", "Captain Seats", "Long Trips"],
    description:
      "The king of comfortable long-distance travel. Spacious captain seats and a smooth ride for larger families and outstation tours.",
  },
  {
    id: "winger",
    name: "Tata Winger",
    type: "15 Seater Van",
    seats: 15,
    price_per_km: 22,
    icon: "bus",
    tag: "Group Travel",
    features: ["15 Seats", "AC", "Push Back Seats", "Group Tours"],
    description:
      "Built for group pilgrimages and family gatherings. Plenty of room to keep everyone together and comfortable.",
  },
  {
    id: "tempo17",
    name: "Tempo Traveller",
    type: "17 Seater",
    seats: 17,
    price_per_km: 25,
    icon: "bus",
    tag: "Group Travel",
    features: ["17 Seats", "AC", "Reclining Seats", "Luggage Space"],
    description:
      "A dependable 17 seater for mid-sized groups — ideal for temple tours and multi-day travel across Uttar Pradesh.",
  },
  {
    id: "tempo20",
    name: "Tempo Traveller",
    type: "20 Seater",
    seats: 20,
    price_per_km: 26,
    icon: "bus",
    tag: "Large Group",
    features: ["20 Seats", "AC", "Comfort Seating", "Long Distance"],
    description:
      "Spacious 20 seater for large groups. Keep your whole yatra party together on comfortable, well-maintained seats.",
  },
  {
    id: "tempo26",
    name: "Tempo Traveller",
    type: "26 Seater",
    seats: 26,
    price_per_km: 34,
    icon: "bus",
    tag: "Extra Large",
    features: ["26 Seats", "AC", "Ample Legroom", "Big Groups"],
    description:
      "Our largest coach for big pilgrimage groups and corporate outings — comfortable seating for up to 26 travellers.",
  },
];

export const FEATURES = [
  {
    icon: "shield",
    title: "Safety First",
    text: "Every vehicle undergoes regular maintenance and safety checks so your journey is always secure.",
  },
  {
    icon: "clock",
    title: "Always On Time",
    text: "Punctuality is our promise. We value your schedule and make sure you reach on time, every time.",
  },
  {
    icon: "wallet",
    title: "Transparent Pricing",
    text: "Competitive per-kilometre rates with no hidden charges — you always know what you pay.",
  },
  {
    icon: "headset",
    title: "24/7 Support",
    text: "Courteous drivers and a responsive support team, ready to help you at any hour of the day.",
  },
  {
    icon: "route",
    title: "Experienced Drivers",
    text: "Local, well-mannered drivers who know every route and temple across Ayodhya and beyond.",
  },
  {
    icon: "star",
    title: "Trusted by Travellers",
    text: "Thousands of happy pilgrims and families who rate our service and rates highly.",
  },
];
export const GALLERY = [
  {
    src: "https://picsum.photos/seed/ayodhya-gallery1/800/600",
    title: "Ram Janmabhoomi",
    category: "Temples",
  },
  {
    src: "https://picsum.photos/seed/ayodhya-gallery2/800/600",
    title: "Saryu Ghat at Dusk",
    category: "Ghats",
  },
  {
    src: "https://picsum.photos/seed/ayodhya-gallery3/800/600",
    title: "Hanuman Garhi",
    category: "Temples",
  },
  {
    src: "https://picsum.photos/seed/ayodhya-gallery4/800/600",
    title: "Our Comfortable Fleet",
    category: "Vehicles",
  },
  {
    src: "https://picsum.photos/seed/ayodhya-gallery5/800/600",
    title: "Ram Ki Paidi",
    category: "Ghats",
  },
  {
    src: "https://picsum.photos/seed/ayodhya-gallery6/800/600",
    title: "Kanak Bhawan",
    category: "Temples",
  },
];

export const DESTINATIONS = [
  {
    name: "Shri Ram Janmabhoomi",
    text: "The grand Ram Mandir — the spiritual heart of Ayodhya.",
    image: "https://picsum.photos/seed/rammandir/800/600",
  },
  {
    name: "Hanuman Garhi",
    text: "A revered hilltop temple dedicated to Lord Hanuman.",
    image: "https://picsum.photos/seed/hanumangarhi/800/600",
  },
  {
    name: "Ram Ki Paidi",
    text: "Beautiful ghats along the Saryu river, magical at sunset.",
    image: "https://picsum.photos/seed/rampaidi/800/600",
  },
  {
    name: "Kanak Bhawan",
    text: "An ornate temple gifted to Sita, rich in heritage.",
    image: "https://picsum.photos/seed/kanakbhawan/800/600",
  },
  {
    name: "Saryu Aarti",
    text: "The mesmerising evening aarti on the banks of the Saryu.",
    image: "https://picsum.photos/seed/saryuaarti/800/600",
  },
  {
    name: "Nageshwarnath Temple",
    text: "One of the oldest temples, founded by Kush.",
    image: "https://picsum.photos/seed/nageshwar/800/600",
  },
];

export const TESTIMONIALS = [
  {
    name: "Ajay Sharma",
    location: "Delhi",
    rating: 5,
    text: "Our trip to Ayodhya with Sanatan Tour And Travels was nothing short of magical. Warm hospitality, a clean cab and a driver who knew every temple. A journey we will cherish forever.",
  },
  {
    name: "Amit Patel",
    location: "Ahmedabad",
    rating: 5,
    text: "The professionalism of the staff and the seamless execution of the itinerary were truly commendable. I felt a deep sense of peace visiting the sacred sites. Highly recommended.",
  },
  {
    name: "Ritesh Verma",
    location: "Lucknow",
    rating: 5,
    text: "As a solo traveller I was a little nervous, but they made all the arrangements and ensured a safe, enriching experience. Returned home with a treasure trove of memories.",
  },
  {
    name: "Rajesh Kapoor",
    location: "Kanpur",
    rating: 5,
    text: "Our family had the most memorable vacation in Ayodhya. Well-planned itinerary, comfortable vehicle and a driver who was wonderful with the kids. Exceeded our expectations!",
  },
  {
    name: "Aryan Singh",
    location: "Varanasi",
    rating: 5,
    text: "By far the most insightful and enjoyable trip I have taken. Personalised attention, expert guidance and spotless organisation. I cannot recommend them highly enough!",
  },
];

export const STATS = [
  { value: "10+", label: "Years of Service" },
  { value: "50k+", label: "Happy Travellers" },
  { value: "9", label: "Vehicle Options" },
  { value: "24/7", label: "Available" },
];
