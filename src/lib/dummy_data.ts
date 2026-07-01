import { type Listing } from "@/lib/types/listing";

export const DUMMY_DATA = {
  popularSearches: [
    "laptop",
    "smartphone",
    "headphones",
    "camera",
    "gaming console",
  ],
  categories: [
    {
      name: "Smartphones",
      slug: "smartphones",
      icon: "Smartphone",
    },
    {
      name: "Tablets",
      slug: "tablets",
      icon: "TabletSmartphone",
    },
    {
      name: "Laptops",
      slug: "laptops",
      icon: "Laptop",
    },
    {
      name: "Desktops",
      slug: "desktops",
      icon: "Monitor",
    },
    {
      name: "Gaming Consoles",
      slug: "gaming-consoles",
      icon: "Gamepad",
    },
    {
      name: "Gaming Accessories",
      slug: "gaming-accessories",
      icon: "Headphones",
    },
    {
      name: "PC Components",
      slug: "pc-components",
      icon: "Cpu",
    },
    {
      name: "Wearables",
      slug: "wearables",
      icon: "Watch",
    },
  ],
  listings: [
    {
      slug: "xiaomi-redmi-note-15-pro-5g-dual-sim-8-256gb-black",
      title: "Xiaomi Redmi Note 15 Pro 5G Dual SIM (8/256GB) Black",
      price: 199,
      isFree: true,
      featured: true,
      location: "Nicosia",
      createdAt: "2026-06-16T12:00:00Z",
      categorySlug: "smartphones",
      images: [
        "https://b.scdn.gr/images/sku_main_images/066114/66114737/xlarge_20260320113707_xiaomi_redmi_note_15_pro_5g_dual_sim_8gb_256gb_black.jpeg",
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Xiaomi+Redmi+Note+15",
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Xiaomi+Redmi+Note+15+2",
      ],
    },
    {
      slug: "samsung-galaxy-tab-s7",
      title: "Samsung Galaxy Tab S7 - 256GB - Mystic Black",
      price: 649,
      location: "Limassol",
      createdAt: "2023-09-15T15:20:00Z",
      categorySlug: "tablets",
      images: [
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Samsung+Galaxy+Tab+S7",
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Samsung+Galaxy+Tab+S7+2",
      ],
    },
    {
      slug: "apple-iphone-13-pro-max",
      title: "Apple iPhone 13 Pro Max - 256GB - Graphite",
      price: 1099,
      priceNegotiable: true,
      location: "Limassol",
      createdAt: "2023-09-15T10:30:00Z",
      categorySlug: "smartphones",
      images: [
        "https://c.scdn.gr/images/sku_main_images/062956/62956505/20250910133615_apple_iphone_17_pro_max_12_256gb_deep_blue.jpeg",
        "https://www.apple.com/v/iphone/home/cj/images/meta/iphone__bh930eyjnj0i_og.png",
        "https://placehold.co/600x400/ff0000/31343C/png?font=roboto&text=Iphone+13+Pro+Max",
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Iphone+13+Pro+Max+2",
        "https://placehold.co/1080x2400/EEE/31343C/png?font=roboto&text=Iphone+13+Pro+Max+2",
      ],
      featured: true,
    },
    {
      slug: "samsung-galaxy-s21-ultra",
      title: "Samsung Galaxy S21 Ultra - 128GB - Phantom Black",
      price: 999,
      location: "Nicosia",
      createdAt: "2023-09-14T14:45:00Z",
      categorySlug: "smartphones",
      images: [
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Samsung+Galaxy+S21+Ultra",
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Samsung+Galaxy+S21+Ultra+2",
      ],
    },
    {
      slug: "dell-xps-15-laptop",
      title: "Dell XPS 15 Laptop - Intel Core i7 - 16GB RAM - 512GB SSD",
      price: 1299,
      location: "Larnaca",
      createdAt: "2023-09-13T09:20:00Z",
      categorySlug: "laptops",
      images: [
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Dell+XPS+15+Laptop",
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Dell+XPS+15+Laptop+2",
      ],
    },
    {
      slug: "sony-playstation-5-console",
      title: "Sony PlayStation 5 Console - Standard Edition",
      price: 499,
      location: "Paphos",
      createdAt: "2023-09-12T16:10:00Z",
      categorySlug: "gaming-consoles",
      images: [
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Sony+PlayStation+5+Console",
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Sony+PlayStation+5+Console+2",
      ],
    },
    {
      slug: "apple-watch-series-7",
      title: "Apple Watch Series 7 - 45mm - Starlight Aluminum Case",
      price: 399,
      location: "Limassol",
      createdAt: "2023-09-11T11:55:00Z",
      categorySlug: "wearables",
      images: [
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Apple+Watch+Series+7",
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Apple+Watch+Series+7+2",
      ],
    },
    {
      slug: "nintendo-switch-oled",
      title: "Nintendo Switch OLED Model - White Joy-Con",
      price: 349,
      location: "Nicosia",
      createdAt: "2023-09-10T13:40:00Z",
      categorySlug: "gaming-consoles",
      images: [
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Nintendo+Switch+OLED",
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Nintendo+Switch+OLED+2",
      ],
      featured: true,
    },
    {
      slug: "bose-noise-cancelling-headphones-700",
      title: "Bose Noise Cancelling Headphones 700 - Black",
      price: null,
      location: "Larnaca",
      createdAt: "2023-09-09T15:25:00Z",
      categorySlug: "gaming-accessories",
      images: [
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Bose+Noise+Cancelling+Headphones+700",
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Bose+Noise+Cancelling+Headphones+700+2",
      ],
      featured: true,
    },
    {
      slug: "free-raspberry-pi-4-kit",
      title: "Free Raspberry Pi 4 Kit - Includes Power Supply and Case",
      price: 0,
      isFree: true,
      location: "Paphos",
      createdAt: "2023-09-08T10:15:00Z",
      categorySlug: "pc-components",
      images: [
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Free+Raspberry+Pi+4+Kit",
        "https://placehold.co/600x400/EEE/31343C/png?font=roboto&text=Free+Raspberry+Pi+4+Kit+2",
      ],
    },
  ],
} satisfies {
  popularSearches: string[];
  categories: {
    name: string;
    slug: string;
    icon: string;
  }[];
  listings: Listing[];
};
