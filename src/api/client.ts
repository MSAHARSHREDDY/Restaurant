const menuCategories = [
  { id: "veg-starters", name: "Veg Starters" },
  { id: "veg-curries", name: "Veg Curries" },
  { id: "non-veg-starters", name: "Non Veg Starters" },
  { id: "non-veg-curries", name: "Non Veg Curries" },
  { id: "biryanis", name: "Biryani's" },
  { id: "rice-noodles", name: "Rice & Noodles" },
  { id: "evening-starters", name: "Evening Starters" },
  { id: "breads", name: "Breads" },
  { id: "drink", name: "Drink" },
  { id: "sweet", name: "Sweet" },
];

export const menuItems = [
  {
    id: 1,
    categoryId: "veg-starters",
    name: "Veg Manchuria",
    description: "Delicious Veg Manchuria",
    price: 299,
    spicy: false,
    prepTime: "15 min",
    rating: 4.8,
    image: "https://media.istockphoto.com/id/1208080913/photo/veg-manchurian-very-popular-chinese-snack-popular-in-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=J5BmLqHWWKnVPDrd06KDpVqZ7JP9J2CLkj2MVhGzvl0=",
  },

  {
    id: 2,
    categoryId: "veg-starters",
    name: "Paneer Chilli",
    description: "Spicy Paneer Chilli",
    price: 199,
    spicy: true,
    prepTime: "15 min",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1200&q=80",
  },

  {
    id: 3,
    categoryId: "veg-starters",
    name: "Gobi Manchuria",
    description: "Crispy Gobi Manchuria",
    price: 399,
    spicy: false,
    prepTime: "15 min",
    rating: 4.5,
    image: "https://media.istockphoto.com/id/1334114441/photo/cabbage-manchurian.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZTYvLiIyWo00AWODCXv9NsnUmyFkExqt82TgjJE2LxI=",
  },

  {
    id: 4,
    categoryId: "veg-starters",
    name: "Paneer Tikka",
    description: "Classic Paneer Tikka",
    price: 299,
    spicy: true,
    prepTime: "20 min",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1200&q=80",
  },

  {
    id: 5,
    categoryId: "veg-curries",
    name: "Dal Fry",
    description: "Comforting Dal Fry",
    price:  129,
    spicy: false,
    prepTime: "10 min",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&q=80",
  },

  {
    id: 6,
    categoryId: "veg-curries",
    name: "Dal Tadka",
    description: "Tempered Dal Tadka",
    price: 199,
    spicy: true,
    prepTime: "10 min",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1596560924090-8c5447de2d34?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGFsJTIwdGhhZGthfGVufDB8fDB8fHww",
  },

  {
    id: 7,
    categoryId: "veg-curries",
    name: "Dal Palak",
    description: "Spinach infused Dal",
    price: 399,
    spicy: false,
    prepTime: "15 min",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1626500154744-e4b394ffea16?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGFsJTIwcGFsYWslMjBjdXJyeXxlbnwwfHwwfHx8MA%3D%3D",
  },

  {
    id: 8,
    categoryId: "veg-curries",
    name: "Palak Paneer",
    description: "Paneer in spinach gravy",
    price: 99,
    spicy: false,
    prepTime: "20 min",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFsYWslMjBwYW5lZXJ8ZW58MHx8MHx8fDA%3D",
  },

  {
    id: 9,
    categoryId: "veg-curries",
    name: "Paneer Butter Masala",
    description: "Rich Paneer Butter Masala",
    price: 299,
    spicy: false,
    prepTime: "20 min",
    rating: 5.0,
    image: "https://media.istockphoto.com/id/1207326109/photo/vegetarian-cheese-tofu-butter-masala-panner-with-roti-closeup-in-a-pan-horizontal.webp?a=1&b=1&s=612x612&w=0&k=20&c=h9YhetHbM35EGUnwMKrM0Pg6SGjL3a19KWF7OvkIYrg=",
  },

  {
    id: 10,
    categoryId: "veg-curries",
    name: "Kadai Paneer",
    description: "Spicy Kadai Paneer",
    price: 199,
    spicy: true,
    prepTime: "20 min",
    rating: 4.7,
    image: "https://media.istockphoto.com/id/1085155140/photo/malai-or-achari-paneer-in-a-gravy-made-using-red-gravy-and-green-capsicum-served-in-a-bowl.webp?a=1&b=1&s=612x612&w=0&k=20&c=uuOixMwBH2i75twcF84mU6eSLIghoIXx9jaqoOlTwSc=",
  },

  {
    id: 11,
    categoryId: "veg-curries",
    name: "Aloo Palak",
    description: "Potatoes and spinach",
    price: 299,
    spicy: false,
    prepTime: "15 min",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200&q=80",
  },

  {
    id: 12,
    categoryId: "veg-curries",
    name: "Methi Chaman",
    description: "Delicious Methi Chaman",
    price: 199,
    spicy: false,
    prepTime: "20 min",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWV0aGklMjBjaGFtYW4lMjBjdXJyeXxlbnwwfHwwfHx8MA%3D%3D",
  },

  {
    id: 13,
    categoryId: "veg-curries",
    name: "Navaratna Kurma",
    description: "Mixed vegetable Kurma",
    price: 299,
    spicy: false,
    prepTime: "20 min",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200&q=80",
  },

  {
    id: 14,
    categoryId: "veg-curries",
    name: "Channa Masala",
    description: "Spicy chickpea curry",
    price: 299,
    spicy: true,
    prepTime: "15 min",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1736680056470-948527554276?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhbm5hJTIwbWFzYWxhfGVufDB8fDB8fHww",
  },

  {
    id: 15,
    categoryId: "non-veg-starters",
    name: "Chicken Tikka (5 Pieces)",
    description: "Grilled chicken chunks",
    price: 299,
    spicy: true,
    prepTime: "20 min",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=1200&q=80",
  },

  {
    id: 16,
    categoryId: "non-veg-starters",
    name: "Malai Tikka (6 Pieces)",
    description: "Creamy chicken tikka",
    price: 299,
    spicy: false,
    prepTime: "20 min",
    rating: 4.8,
    image: "https://media.istockphoto.com/id/812470140/photo/chicken-malai-tikka-boneless-piece.jpg?s=612x612&w=0&k=20&c=jZJ1TgLrwl2_PKr0zeo2esSTgfGeHoOuANAogzlfkMU=",
  },

  {
    id: 17,
    categoryId: "non-veg-starters",
    name: "Chicken Lollipop",
    description: "Spicy chicken winglets",
    price: 399,
    spicy: true,
    prepTime: "15 min",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&q=80",
  },

  {
    id: 18,
    categoryId: "non-veg-starters",
    name: "Chicken 65",
    description: "Deep fried spicy chicken",
    price: 79,
    spicy: true,
    prepTime: "15 min",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=1200&q=80",
  },

  {
    id: 19,
    categoryId: "non-veg-starters",
    name: "Chilli Chicken",
    description: "Indo-chinese chili chicken",
    price: 99,
    spicy: true,
    prepTime: "15 min",
    rating: 4.7,
    image: "https://plus.unsplash.com/premium_photo-1669742927923-32d9ee86887c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpbGxpJTIwY2hpY2tlbnxlbnwwfHwwfHx8MA%3D%3D",
  },

  {
    id: 20,
    categoryId: "non-veg-starters",
    name: "Ginger Chicken",
    description: "Chicken in ginger sauce",
    price: 151,
    spicy: false,
    prepTime: "15 min",
    rating: 4.5,
    image: "https://media.istockphoto.com/id/1203376683/photo/thai-basil-chicken-asian-style-chicken-in-a-white-bowl-with-chopsticks-white-background-top.webp?a=1&b=1&s=612x612&w=0&k=20&c=QRpVwLr-g1S2NoVQDqgzAD6o1jNUmHAwbM7eOSVm2y0=",
  },

  {
    id: 21,
    categoryId: "non-veg-starters",
    name: "Garlic Chicken",
    description: "Chicken in garlic sauce",
    price: 129,
    spicy: false,
    prepTime: "15 min",
    rating: 4.6,
    image: "https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2FybGljJTIwY2hpY2tlbnxlbnwwfHwwfHx8MA%3D%3D",
  },

  {
    id: 22,
    categoryId: "non-veg-curries",
    name: "Chicken Tikka Masala",
    description: "Roasted chicken in curry",
    price: 139,
    spicy: true,
    prepTime: "20 min",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=80",
  },

  {
    id: 23,
    categoryId: "non-veg-curries",
    name: "Butter Chicken",
    description: "Rich buttery chicken curry",
    price: 159,
    spicy: false,
    prepTime: "25 min",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=1200&q=80",
  },

  {
    id: 24,
    categoryId: "non-veg-curries",
    name: "Kadai Chicken",
    description: "Spicy chicken with bell peppers",
    price: 169,
    spicy: true,
    prepTime: "20 min",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=1200&q=80",
  },

  {
    id: 25,
    categoryId: "non-veg-curries",
    name: "Andhra Chicken Curry",
    description: "Very spicy regional curry",
    price: 129,
    spicy: true,
    prepTime: "20 min",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=1200&q=80",
  },

  {
    id: 26,
    categoryId: "non-veg-curries",
    name: "Chicken Masala",
    description: "Flavorful chicken curry",
    price: 99,
    spicy: true,
    prepTime: "20 min",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=80",
  },

  {
    id: 27,
    categoryId: "non-veg-curries",
    name: "Chicken Chapata",
    description: "Tangy and spicy chicken",
    price: 129,
    spicy: true,
    prepTime: "20 min",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=1200&q=80",
  },

  {
    id: 28,
    categoryId: "biryanis",
    name: "Veg Biryani",
    description: "Aromatic vegetable rice",
    price: 199,
    spicy: false,
    prepTime: "25 min",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&q=80",
  },

  {
    id: 29,
    categoryId: "biryanis",
    name: "Chicken Biryani",
    description: "Classic chicken biryani",
    price: 299,
    spicy: true,
    prepTime: "30 min",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&q=80",
  },

  {
    id: 30,
    categoryId: "biryanis",
    name: "Chicken 65 Biryani",
    description: "Biryani with Chicken 65",
    price: 299,
    spicy: true,
    prepTime: "30 min",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1200&q=80",
  },

  {
    id: 31,
    categoryId: "biryanis",
    name: "Chicken Lollipop Biryani",
    description: "Biryani with chicken lollipops",
    price: 399,
    spicy: true,
    prepTime: "30 min",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1200&q=80",
  },

  {
    id: 32,
    categoryId: "biryanis",
    name: "Prawns Biryani",
    description: "Spicy prawns with aromatic rice",
    price: 129,
    spicy: true,
    prepTime: "35 min",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=1200&q=80",
  },

  {
    id: 33,
    categoryId: "rice-noodles",
    name: "Veg Fried Rice",
    description: "Classic vegetable fried rice",
    price: 59,
    spicy: false,
    prepTime: "15 min",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=1200&q=80",
  },

  {
    id: 34,
    categoryId: "rice-noodles",
    name: "Egg Fried Rice",
    description: "Fried rice with egg",
    price: 79,
    spicy: false,
    prepTime: "15 min",
    rating: 4.6,
    image: "https://media.istockphoto.com/id/1397479529/photo/asian-chicken-fried-rice-with-chopsticks-directly-above-photo.webp?a=1&b=1&s=612x612&w=0&k=20&c=iUQyGOH64no8H4DppXoNkphr9mmtmO1XI0vYAsxaxRM=",
  },

  {
    id: 35,
    categoryId: "rice-noodles",
    name: "Chicken Fried Rice",
    description: "Fried rice with chicken pieces",
    price: 99,
    spicy: false,
    prepTime: "15 min",
    rating: 4.8,
    image: "https://plus.unsplash.com/premium_photo-1694141252774-c937d97641da?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbmZyaWVkJTIwcmljZXxlbnwwfHwwfHx8MA%3D%3D",
  },

  {
    id: 36,
    categoryId: "rice-noodles",
    name: "Jeera Rice",
    description: "Cumin tempered rice",
    price: 89,
    spicy: false,
    prepTime: "10 min",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200&q=80",
  },

  {
    id: 37,
    categoryId: "rice-noodles",
    name: "Veg Noodles",
    description: "Stir fried vegetable noodles",
    price: 59,
    spicy: false,
    prepTime: "15 min",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=1200&q=80",
  },

  {
    id: 38,
    categoryId: "rice-noodles",
    name: "Egg Noodles",
    description: "Stir fried egg noodles",
    price: 79,
    spicy: false,
    prepTime: "15 min",
    rating: 4.6,
    image: "https://plus.unsplash.com/premium_photo-1694670234085-4f38b261ce5b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RWdnJTIwTm9vZGxlc3xlbnwwfHwwfHx8MA%3D%3D",
  },

  {
    id: 39,
    categoryId: "rice-noodles",
    name: "Chicken Noodles",
    description: "Stir fried chicken noodles",
    price: 99,
    spicy: false,
    prepTime: "15 min",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1690370714705-6fd90ab5807d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNoaWNrZW4lMjBOb29kbGVzfGVufDB8fDB8fHww",
  },

  {
    id: 40,
    categoryId: "evening-starters",
    name: "Veg Momos",
    description: "Steamed vegetable dumplings",
    price: 59,
    spicy: false,
    prepTime: "15 min",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=1200&q=80",
  },

  {
    id: 41,
    categoryId: "evening-starters",
    name: "Fried Chicken",
    description: "Crispy fried chicken",
    price: 99,
    spicy: false,
    prepTime: "20 min",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=1200&q=80",
  },

  {
    id: 42,
    categoryId: "evening-starters",
    name: "Finger Chips",
    description: "Crispy french fries",
    price: 69,
    spicy: false,
    prepTime: "10 min",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1200&q=80",
  },

  {
    id: 43,
    categoryId: "breads",
    name: "Chapathi",
    description: "Soft wheat flatbread",
    price: 30,
    spicy: false,
    prepTime: "5 min",
    rating: 4.5,
    image: "https://plus.unsplash.com/premium_photo-1663855531852-36f2b217faa8?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hhcGF0aXxlbnwwfHwwfHx8MA%3D%3D",
  },

  {
    id: 44,
    categoryId: "breads",
    name: "Pulka",
    description: "Puffed wheat flatbread",
    price: 49,
    spicy: false,
    prepTime: "5 min",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1708782343717-be4ea260249a?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVsa2ElMjBjaGFwYXRpfGVufDB8fDB8fHww",
  },

  {
    id: 45,
    categoryId: "breads",
    name: "Parota",
    description: "Flaky layered flatbread",
    price: 59,
    spicy: false,
    prepTime: "5 min",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1619714604882-db1396d4a718?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBhcm90YSUyMGNoYXBhdGl8ZW58MHx8MHx8fDA%3D",
  },

  {
    id: 46,
    categoryId: "drink",
    name: "Water Bottle (500ML)",
    description: "Mineral water",
    price: 29,
    spicy: false,
    prepTime: "1 min",
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1741518516939-cb68a5b7624b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHBsYXN0aWMlMjBib3R0bGV8ZW58MHx8MHx8fDA%3D",
  },

  {
    id: 47,
    categoryId: "drink",
    name: "Mojito (Lemon Mint)",
    description: "Refreshing lemon mint drink",
    price: 89,
    spicy: false,
    prepTime: "5 min",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=1200&q=80",
  },

  {
    id: 48,
    categoryId: "sweet",
    name: "Fruit Salad",
    description: "Fresh mixed fruits",
    price: 69,
    spicy: false,
    prepTime: "10 min",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJ1aXQlMjBzYWxhZHxlbnwwfHwwfHx8MA%3D%3D",
  },
];

const galleryItems = [
  { id: 1, type: "image", category: "interior", src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2000&auto=format&fit=crop", title: "First Class Dining Cabin" },
  { id: 2, type: "image", category: "food", src: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=2000&auto=format&fit=crop", title: "Signature Biryani" },
  { id: 4, type: "image", category: "food", src: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=2000&auto=format&fit=crop", title: "Gourmet Curries" },
  { id: 5, type: "image", category: "interior", src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop", title: "Aviation Theme Details" },
  { id: 6, type: "image", category: "experience", src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2000&auto=format&fit=crop", title: "Immersive Boarding" },
];

// Dynamic state management for custom in-flight gourmet menu
let localMenuCategories = [...menuCategories];
if (typeof window !== "undefined") {
  const storedCats = localStorage.getItem("kvr_menu_categories");
  if (storedCats) {
    try {
      localMenuCategories = JSON.parse(storedCats);
    } catch (e) {
      console.error("Failed to parse kvr_menu_categories from localStorage", e);
    }
  } else {
    localStorage.setItem("kvr_menu_categories", JSON.stringify(menuCategories));
  }
}

let localMenuItems = [...menuItems];
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("kvr_menu_items");
  if (stored) {
    try {
      localMenuItems = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse kvr_menu_items from localStorage", e);
    }
  } else {
    localStorage.setItem("kvr_menu_items", JSON.stringify(menuItems));
  }
}

export const getMenuCategories = async () => {
  return localMenuCategories;
};

export const getMenuItems = async (category?: string) => {
  if (category && category !== 'all') {
    return localMenuItems.filter(item => item.categoryId === category);
  }
  return localMenuItems;
};

export const updateMenuItemInStorage = async (updatedItem: any) => {
  localMenuItems = localMenuItems.map(item => item.id.toString() === updatedItem.id.toString() ? updatedItem : item);
  if (typeof window !== "undefined") {
    localStorage.setItem("kvr_menu_items", JSON.stringify(localMenuItems));
  }
  return localMenuItems;
};

export const deleteMenuItemInStorage = async (id: any) => {
  localMenuItems = localMenuItems.filter(item => item.id.toString() !== id.toString());
  if (typeof window !== "undefined") {
    localStorage.setItem("kvr_menu_items", JSON.stringify(localMenuItems));
  }
  return localMenuItems;
};

export const addMenuItemInStorage = async (newItem: any) => {
  const nextId = localMenuItems.length > 0 ? Math.max(...localMenuItems.map(item => Number(item.id))) + 1 : 1;
  const itemToAdd = { ...newItem, id: nextId };
  localMenuItems.unshift(itemToAdd);
  if (typeof window !== "undefined") {
    localStorage.setItem("kvr_menu_items", JSON.stringify(localMenuItems));
  }
  return itemToAdd;
};

export const addMenuCategoryInStorage = async (newCat: any) => {
  localMenuCategories.push(newCat);
  if (typeof window !== "undefined") {
    localStorage.setItem("kvr_menu_categories", JSON.stringify(localMenuCategories));
  }
  return newCat;
};

export const updateMenuCategoryInStorage = async (updatedCat: any) => {
  localMenuCategories = localMenuCategories.map(cat => cat.id === updatedCat.id ? updatedCat : cat);
  if (typeof window !== "undefined") {
    localStorage.setItem("kvr_menu_categories", JSON.stringify(localMenuCategories));
  }
  return localMenuCategories;
};

export const deleteMenuCategoryInStorage = async (id: string) => {
  localMenuCategories = localMenuCategories.filter(cat => cat.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem("kvr_menu_categories", JSON.stringify(localMenuCategories));
  }
  // Also clean up or adjust items that belong to this deleted category
  localMenuItems = localMenuItems.filter(item => item.categoryId !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem("kvr_menu_items", JSON.stringify(localMenuItems));
  }
  return localMenuCategories;
};

export const getGalleryItems = async () => {
  return galleryItems;
};

export const submitContact = async (formData: any) => {
  console.log("Mock submit contact", formData);
  return { success: true };
};

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const getReservations = async () => {
  try {
    const res = await fetch("/api/reservations", {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error("Failed to fetch reservations");
    const data = await res.json();
    return data.map((r: any) => ({
      ...r,
      id: r._id || r.id
    }));
  } catch (error) {
    console.error("Error in getReservations:", error);
    const stored = typeof window !== "undefined" ? localStorage.getItem("kvr_reservations") : null;
    return stored ? JSON.parse(stored) : [];
  }
};

export const submitReservation = async (formData: any) => {
  try {
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify(formData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to submit reservation");
    }
    const data = await res.json();
    if (data.reservation) {
      data.reservation.id = data.reservation._id || data.reservation.id;
    }
    return data;
  } catch (error) {
    console.error("Error in submitReservation:", error);
    const randomSeatLetters = ['A', 'F', 'B', 'C', 'D', 'K'];
    const randomSeatNum = Math.floor(Math.random() * 24) + 1;
    const newRes = {
      id: Date.now(),
      name: formData.name || "Anonymous Passenger",
      email: formData.email || "",
      phone: formData.phone || "",
      date: formData.date || new Date().toISOString().split('T')[0],
      time: formData.time || "12:00",
      guests: Number(formData.guests) || 1,
      seatNumber: formData.seatNumber || `${randomSeatNum}${randomSeatLetters[Math.floor(Math.random() * randomSeatLetters.length)]}`,
      status: "Pending",
      classType: formData.classType || "First Class"
    };
    let stored = [];
    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("kvr_reservations");
      stored = existing ? JSON.parse(existing) : [];
      stored.unshift(newRes);
      localStorage.setItem("kvr_reservations", JSON.stringify(stored));
    }
    return { success: true, reservation: newRes };
  }
};

export const updateReservationInStorage = async (updatedRes: any) => {
  try {
    const resId = updatedRes._id || updatedRes.id;
    const res = await fetch(`/api/reservations/${resId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify(updatedRes)
    });
    if (!res.ok) throw new Error("Failed to update reservation");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in updateReservationInStorage:", error);
    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("kvr_reservations");
      if (existing) {
        let stored = JSON.parse(existing);
        stored = stored.map((r: any) => r.id.toString() === updatedRes.id.toString() ? updatedRes : r);
        localStorage.setItem("kvr_reservations", JSON.stringify(stored));
        return stored;
      }
    }
    return [updatedRes];
  }
};

export const deleteReservationInStorage = async (id: any) => {
  try {
    const res = await fetch(`/api/reservations/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete reservation");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in deleteReservationInStorage:", error);
    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("kvr_reservations");
      if (existing) {
        let stored = JSON.parse(existing);
        stored = stored.filter((r: any) => r.id.toString() !== id.toString());
        localStorage.setItem("kvr_reservations", JSON.stringify(stored));
        return stored;
      }
    }
    return [];
  }
};
