export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Mains" | "Sides" | "Drinks" | "Specials";
  spicyLevel: "Mild" | "Medium" | "Hot";
  available: boolean;
};

export const menuItems: MenuItem[] = [
  {
    id: "jerk-chicken",
    name: "Jerk Chicken",
    description: "Charcoal-grilled leg quarter with jerk glaze and house slaw.",
    price: 15.5,
    category: "Mains",
    spicyLevel: "Hot",
    available: true,
  },
  {
    id: "oxtail",
    name: "Braised Oxtail",
    description: "Slow-cooked oxtail in rich brown gravy with butter beans.",
    price: 21,
    category: "Mains",
    spicyLevel: "Medium",
    available: true,
  },
  {
    id: "curry-goat",
    name: "Curry Goat",
    description:
      "Traditional curry goat with Scotch bonnet, thyme, and potato.",
    price: 19.5,
    category: "Mains",
    spicyLevel: "Medium",
    available: true,
  },
  {
    id: "escovitch-fish",
    name: "Escovitch Fish",
    description:
      "Fried snapper topped with pickled peppers, onions, and carrots.",
    price: 24,
    category: "Specials",
    spicyLevel: "Mild",
    available: false,
  },
  {
    id: "rice-and-peas",
    name: "Rice and Peas",
    description: "Coconut rice cooked with red peas and fresh scallion.",
    price: 5,
    category: "Sides",
    spicyLevel: "Mild",
    available: true,
  },
  {
    id: "festival",
    name: "Festival",
    description: "Sweet fried cornmeal dumplings. Sold in portions of 3.",
    price: 4.5,
    category: "Sides",
    spicyLevel: "Mild",
    available: true,
  },
  {
    id: "sorrel",
    name: "Sorrel Ginger",
    description: "House-brewed sorrel with ginger and citrus peel.",
    price: 4,
    category: "Drinks",
    spicyLevel: "Mild",
    available: true,
  },
  {
    id: "irish-moss",
    name: "Irish Moss",
    description: "Creamy sea moss punch with vanilla and nutmeg.",
    price: 5,
    category: "Drinks",
    spicyLevel: "Mild",
    available: true,
  },
];

export const dashboardKpis = {
  todaysOrders: 96,
  avgTicket: 22.8,
  topDish: "Jerk Chicken",
  repeatRate: 38,
};
