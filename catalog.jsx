// catalog.jsx — Real Nino's preset designs, landing, and inspo flow.

const { useState: useStateC, useMemo: useMemoC } = React;

// === Real Nino's design collections (from menu data) ===
const PRESETS = [
  // — Bento Cakes (EGP 365) —
  { id: 'sweet-sprinkles', name: 'Sweet Sprinkles', collection: 'Bento Cake', occasion: 'just-because', theme: 'sweet',
    shape: 'bento', tiers: 1, frostColor: '#FCF8EF', toppingColor: '#E35F40',
    toppings: [
      { kind: 'sprinkles', color: '#E35F40', x: 0.25, y: 0.35 },
      { kind: 'sprinkles', color: '#FFDC4A', x: 0.40, y: 0.45 },
      { kind: 'sprinkles', color: '#7FB0E7', x: 0.55, y: 0.32 },
      { kind: 'sprinkles', color: '#FFBFBE', x: 0.70, y: 0.55 },
      { kind: 'sprinkles', color: '#A8D5BA', x: 0.50, y: 0.65 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 550, tags: ['Bento'] },
  { id: 'og-bento', name: 'The OG Bento', collection: 'Bento Cake', occasion: 'just-because', theme: 'sweet',
    shape: 'bento', tiers: 1, frostColor: '#FFE4E2', toppingColor: '#6B0F1A',
    toppings: [{ kind: 'hearts', color: '#6B0F1A', x: 0.50, y: 0.45 }],
    flavor: 'lotus', basePrice: 550, tags: ['Bento', 'Bestseller'] },
  { id: 'pink-floral-bento', name: 'Pink Floral', collection: 'Bento Cake', occasion: 'birthday-adults', theme: 'aesthetic',
    shape: 'bento', tiers: 1, frostColor: '#FFBFBE', toppingColor: '#A8D5BA',
    toppings: [
      { kind: 'flowers', color: '#A8D5BA', x: 0.30, y: 0.40 },
      { kind: 'flowers', color: '#FFDC4A', x: 0.50, y: 0.35 },
      { kind: 'flowers', color: '#A8D5BA', x: 0.70, y: 0.45 },
    ],
    flavor: 'vanilla-raspberry', basePrice: 550, tags: ['Bento'] },
  { id: 'silver-numbers-bento', name: 'Silver Numbers', collection: 'Bento Cake', occasion: 'birthday-adults', theme: 'minimal',
    shape: 'bento', tiers: 1, frostColor: '#FCF8EF', toppingColor: '#C9BFBC',
    toppings: [
      { kind: 'pearls', color: '#FFFFFF', x: 0.30, y: 0.42 },
      { kind: 'pearls', color: '#FFFFFF', x: 0.50, y: 0.34 },
      { kind: 'pearls', color: '#FFFFFF', x: 0.70, y: 0.42 },
    ],
    flavor: 'chocolate-ganache', basePrice: 550, tags: ['Bento', 'Milestone'] },
  { id: 'rosette-bento', name: 'Rosette Bento', collection: 'Bento Cake', occasion: 'valentines', theme: 'heart',
    shape: 'bento', tiers: 1, frostColor: '#FFBFBE', toppingColor: '#FFBFBE',
    toppings: [
      { kind: 'flowers', color: '#FFE4E2', x: 0.30, y: 0.40 },
      { kind: 'flowers', color: '#FFBFBE', x: 0.50, y: 0.32 },
      { kind: 'flowers', color: '#FFE4E2', x: 0.70, y: 0.40 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 550, tags: ['Bento'] },

  // — Buttercream Cakes (EGP 1350+) —
  { id: 'heart-of-love', name: 'Heart of LOVE', collection: 'Buttercream Madness', occasion: 'valentines', theme: 'heart',
    shape: 'heart', tiers: 1, frostColor: '#FFBFBE', toppingColor: '#E35F40',
    toppings: [
      { kind: 'hearts', color: '#E35F40', x: 0.30, y: 0.42 },
      { kind: 'hearts', color: '#E35F40', x: 0.50, y: 0.32 },
      { kind: 'hearts', color: '#E35F40', x: 0.70, y: 0.42 },
      { kind: 'hearts', color: '#6B0F1A', x: 0.40, y: 0.60 },
      { kind: 'hearts', color: '#6B0F1A', x: 0.60, y: 0.60 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 1200, message: 'i love you', tags: ['Bestseller', 'Romantic'] },
  { id: 'chocolate-drip', name: 'Chocolate Drip', collection: 'Drip It Like Its Hot', occasion: 'birthday-adults', theme: 'velvet',
    shape: 'round', tiers: 1, frostColor: '#FCF8EF', toppingColor: '#2A1A18',
    toppings: [
      { kind: 'berries', color: '#6B0F1A', x: 0.30, y: 0.40 },
      { kind: 'berries', color: '#6B0F1A', x: 0.50, y: 0.32 },
      { kind: 'berries', color: '#6B0F1A', x: 0.70, y: 0.40 },
      { kind: 'flowers', color: '#FFBFBE', x: 0.42, y: 0.62 },
      { kind: 'flowers', color: '#FFBFBE', x: 0.58, y: 0.62 },
    ],
    flavor: 'chocolate-ganache', basePrice: 1200, tags: ['Bestseller'] },
  { id: 'color-block', name: 'Color Block', collection: 'Buttercream Madness', occasion: 'birthday-adults', theme: 'aesthetic',
    shape: 'round', tiers: 1, frostColor: '#FFBFBE', toppingColor: '#FFDC4A',
    toppings: [
      { kind: 'flowers', color: '#FFDC4A', x: 0.30, y: 0.40 },
      { kind: 'flowers', color: '#A8D5BA', x: 0.50, y: 0.32 },
      { kind: 'flowers', color: '#7FB0E7', x: 0.70, y: 0.40 },
      { kind: 'flowers', color: '#FFDC4A', x: 0.40, y: 0.60 },
      { kind: 'flowers', color: '#A8D5BA', x: 0.60, y: 0.60 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 1200, tags: ['Most loved'] },
  { id: 'pinkish-gold', name: 'Pinkish Gold Number', collection: 'Buttercream Madness', occasion: 'birthday-adults', theme: 'aesthetic',
    shape: 'number', tiers: 1, frostColor: '#FFBFBE', toppingColor: '#FFDC4A',
    toppings: [
      { kind: 'flowers', color: '#FFDC4A', x: 0.50, y: 0.30 },
      { kind: 'pearls', color: '#FFFFFF', x: 0.40, y: 0.50 },
      { kind: 'pearls', color: '#FFFFFF', x: 0.60, y: 0.50 },
    ],
    flavor: 'lotus', basePrice: 1400, tags: ['Milestone'] },
  { id: 'ice-cream-cone', name: 'Ice Cream Cone', collection: 'Buttercream Madness', occasion: 'birthday-kids', theme: 'unicorn',
    shape: 'round', tiers: 1, frostColor: '#FFE4E2', toppingColor: '#7FB0E7',
    toppings: [
      { kind: 'sprinkles', color: '#7FB0E7', x: 0.30, y: 0.40 },
      { kind: 'sprinkles', color: '#FFDC4A', x: 0.50, y: 0.32 },
      { kind: 'sprinkles', color: '#E35F40', x: 0.70, y: 0.40 },
    ],
    flavor: 'cookies-and-cream', basePrice: 1200, tags: ['Kids'] },
  { id: 'shining-bright', name: 'Shining Bright', collection: 'Buttercream Madness', occasion: 'birthday-adults', theme: 'aesthetic',
    shape: 'round', tiers: 1, frostColor: '#FFDC4A', toppingColor: '#E35F40',
    toppings: [
      { kind: 'sprinkles', color: '#E35F40', x: 0.30, y: 0.40 },
      { kind: 'sprinkles', color: '#E35F40', x: 0.50, y: 0.32 },
      { kind: 'sprinkles', color: '#E35F40', x: 0.70, y: 0.40 },
      { kind: 'hearts', color: '#E35F40', x: 0.50, y: 0.55 },
    ],
    flavor: 'vanilla-caramel', basePrice: 1200, tags: [] },

  // — Animal Cakes —
  { id: 'unicorn-magic', name: 'Unicorn Magic', collection: 'Animal Lovers', occasion: 'birthday-kids', theme: 'unicorn',
    shape: 'round', tiers: 2, frostColor: '#FFE4E2', toppingColor: '#7FB0E7',
    toppings: [
      { kind: 'flowers', color: '#7FB0E7', x: 0.25, y: 0.40 },
      { kind: 'flowers', color: '#FFDC4A', x: 0.50, y: 0.32 },
      { kind: 'flowers', color: '#A8D5BA', x: 0.75, y: 0.40 },
      { kind: 'pearls', color: '#FFFFFF', x: 0.35, y: 0.62 },
      { kind: 'pearls', color: '#FFFFFF', x: 0.50, y: 0.70 },
      { kind: 'pearls', color: '#FFFFFF', x: 0.65, y: 0.62 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 1500, tags: ['Kids'] },
  { id: 'cutest-dino', name: 'Cutest Dino', collection: 'Animal Lovers', occasion: 'birthday-kids', theme: 'dinosaur',
    shape: 'round', tiers: 1, frostColor: '#A8D5BA', toppingColor: '#6B0F1A',
    toppings: [
      { kind: 'berries', color: '#6B0F1A', x: 0.30, y: 0.45 },
      { kind: 'berries', color: '#6B0F1A', x: 0.55, y: 0.50 },
      { kind: 'berries', color: '#6B0F1A', x: 0.72, y: 0.42 },
      { kind: 'flowers', color: '#FFDC4A', x: 0.42, y: 0.62 },
    ],
    flavor: 'chocolate-ganache', basePrice: 1200, tags: ['Kids'] },
  { id: 'mermaid-dreams', name: 'Mermaid Dreams', collection: 'Animal Lovers', occasion: 'birthday-kids', theme: 'unicorn',
    shape: 'round', tiers: 2, frostColor: '#7FB0E7', toppingColor: '#FFBFBE',
    toppings: [
      { kind: 'pearls', color: '#FFFFFF', x: 0.25, y: 0.40 },
      { kind: 'pearls', color: '#FFFFFF', x: 0.50, y: 0.32 },
      { kind: 'pearls', color: '#FFFFFF', x: 0.75, y: 0.40 },
      { kind: 'flowers', color: '#FFBFBE', x: 0.40, y: 0.62 },
      { kind: 'flowers', color: '#FFBFBE', x: 0.60, y: 0.62 },
    ],
    flavor: 'vanilla-blueberry', basePrice: 1500, tags: ['Kids'] },
  { id: 'kitten-lovers', name: 'Kitten Lovers', collection: 'Animal Lovers', occasion: 'birthday-kids', theme: 'princess',
    shape: 'round', tiers: 1, frostColor: '#FFE4E2', toppingColor: '#6B0F1A',
    toppings: [
      { kind: 'hearts', color: '#6B0F1A', x: 0.40, y: 0.45 },
      { kind: 'hearts', color: '#FFBFBE', x: 0.60, y: 0.45 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 1200, tags: ['Kids'] },

  // — Flower Cakes —
  { id: 'floral-beauty', name: 'Floral Beauty', collection: 'Flower Power', occasion: 'birthday-adults', theme: 'garden',
    shape: 'round', tiers: 1, frostColor: '#FCF8EF', toppingColor: '#FFBFBE',
    toppings: [
      { kind: 'flowers', color: '#FFBFBE', x: 0.30, y: 0.40 },
      { kind: 'flowers', color: '#FFE4E2', x: 0.50, y: 0.32 },
      { kind: 'flowers', color: '#FFBFBE', x: 0.70, y: 0.40 },
      { kind: 'flowers', color: '#FFE4E2', x: 0.40, y: 0.62 },
      { kind: 'flowers', color: '#FFBFBE', x: 0.60, y: 0.62 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 1200, tags: ['Spring'] },
  { id: 'buttercream-wreath', name: 'Buttercream Wreath', collection: 'Flower Power', occasion: 'wedding', theme: 'classic-w',
    shape: 'round', tiers: 2, frostColor: '#FCF8EF', toppingColor: '#FFBFBE',
    toppings: [
      { kind: 'flowers', color: '#FFBFBE', x: 0.25, y: 0.40 },
      { kind: 'flowers', color: '#FFE4E2', x: 0.42, y: 0.32 },
      { kind: 'flowers', color: '#A8D5BA', x: 0.58, y: 0.32 },
      { kind: 'flowers', color: '#FFBFBE', x: 0.75, y: 0.40 },
      { kind: 'flowers', color: '#FFE4E2', x: 0.50, y: 0.62 },
    ],
    flavor: 'lemon-buttercream', basePrice: 2400, tags: ['Wedding'] },
  { id: 'floral-sunset', name: 'Floral Sunset', collection: 'Flower Power', occasion: 'birthday-adults', theme: 'garden',
    shape: 'round', tiers: 1, frostColor: '#F39580', toppingColor: '#FFDC4A',
    toppings: [
      { kind: 'flowers', color: '#FFDC4A', x: 0.30, y: 0.40 },
      { kind: 'flowers', color: '#E35F40', x: 0.50, y: 0.32 },
      { kind: 'flowers', color: '#FFDC4A', x: 0.70, y: 0.40 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 1200, tags: [] },

  // — Selfie Cakes —
  { id: 'og-selfie', name: 'OG Selfie Cake', collection: 'Selfie Cakes', occasion: 'birthday-adults', theme: 'aesthetic',
    shape: 'picture', tiers: 1, frostColor: '#FCF8EF', toppingColor: '#E35F40',
    toppings: [
      { kind: 'hearts', color: '#E35F40', x: 0.20, y: 0.30 },
      { kind: 'hearts', color: '#FFDC4A', x: 0.80, y: 0.30 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 1500, tags: ['Photo'] },
  { id: 'rainbow-selfie', name: 'Rainbow Selfie', collection: 'Selfie Cakes', occasion: 'birthday-kids', theme: 'princess',
    shape: 'picture', tiers: 1, frostColor: '#FFBFBE', toppingColor: '#FFDC4A',
    toppings: [
      { kind: 'flowers', color: '#FFDC4A', x: 0.20, y: 0.25 },
      { kind: 'flowers', color: '#7FB0E7', x: 0.50, y: 0.20 },
      { kind: 'flowers', color: '#A8D5BA', x: 0.80, y: 0.25 },
    ],
    flavor: 'cookies-and-cream', basePrice: 1500, tags: ['Photo', 'Kids'] },

  // — Character Cakes (Marvel / Food Mania) —
  { id: 'spider-man', name: 'Spider-Man', collection: 'Marvel Fans', occasion: 'birthday-kids', theme: 'superhero',
    shape: 'round', tiers: 1, frostColor: '#E35F40', toppingColor: '#3D5A99',
    toppings: [{ kind: 'hearts', color: '#3D5A99', x: 0.50, y: 0.45 }],
    flavor: 'chocolate-nutella', basePrice: 1200, tags: ['Kids', 'Character'] },
  { id: 'kfc-bucket', name: 'KFC Bucket', collection: 'Food Mania', occasion: 'birthday-adults', theme: 'velvet',
    shape: 'round', tiers: 1, frostColor: '#E35F40', toppingColor: '#FCF8EF',
    toppings: [
      { kind: 'sprinkles', color: '#FCF8EF', x: 0.30, y: 0.40 },
      { kind: 'sprinkles', color: '#FCF8EF', x: 0.50, y: 0.32 },
      { kind: 'sprinkles', color: '#FCF8EF', x: 0.70, y: 0.40 },
    ],
    flavor: 'chocolate-crispy', basePrice: 1200, tags: [] },

  // — Occasion Cakes —
  { id: 'graduation-cake', name: 'Graduation Cake', collection: 'Celebrating Occasions', occasion: 'graduation', theme: 'gold',
    shape: 'square', tiers: 1, frostColor: '#FCF8EF', toppingColor: '#FFDC4A',
    toppings: [
      { kind: 'sprinkles', color: '#FFDC4A', x: 0.30, y: 0.40 },
      { kind: 'sprinkles', color: '#FFDC4A', x: 0.50, y: 0.32 },
      { kind: 'sprinkles', color: '#FFDC4A', x: 0.70, y: 0.40 },
      { kind: 'hearts', color: '#6B0F1A', x: 0.50, y: 0.65 },
    ],
    flavor: 'lotus', basePrice: 1200, message: 'mabrouk', tags: ['Milestone'] },
  { id: 'eid-classic', name: 'Eid Mubarak', collection: 'Celebrating Occasions', occasion: 'eid', theme: 'classic',
    shape: 'round', tiers: 2, frostColor: '#E8C5A0', toppingColor: '#6B0F1A',
    toppings: [
      { kind: 'flowers', color: '#6B0F1A', x: 0.30, y: 0.40 },
      { kind: 'flowers', color: '#FFDC4A', x: 0.50, y: 0.32 },
      { kind: 'flowers', color: '#6B0F1A', x: 0.70, y: 0.40 },
      { kind: 'pearls', color: '#FFDC4A', x: 0.40, y: 0.62 },
      { kind: 'pearls', color: '#FFDC4A', x: 0.60, y: 0.62 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 1500, message: 'eid mubarak', tags: ['Seasonal'] },
  { id: 'golden-star', name: 'Welcoming Golden Star', collection: 'Celebrating Occasions', occasion: 'baby-shower', theme: 'baby-blue',
    shape: 'round', tiers: 2, frostColor: '#7FB0E7', toppingColor: '#FFDC4A',
    toppings: [
      { kind: 'pearls', color: '#FFDC4A', x: 0.30, y: 0.40 },
      { kind: 'pearls', color: '#FFFFFF', x: 0.50, y: 0.32 },
      { kind: 'pearls', color: '#FFDC4A', x: 0.70, y: 0.40 },
    ],
    flavor: 'vanilla-blueberry', basePrice: 1500, tags: ['Baby'] },
  { id: 'wedding-classic', name: 'Classic White', collection: 'Celebrating Occasions', occasion: 'wedding', theme: 'classic-w',
    shape: 'round', tiers: 3, frostColor: '#FCF8EF', toppingColor: '#FCF8EF',
    toppings: [
      { kind: 'flowers', color: '#FFBFBE', x: 0.30, y: 0.40 },
      { kind: 'flowers', color: '#FCF8EF', x: 0.50, y: 0.32 },
      { kind: 'flowers', color: '#FFBFBE', x: 0.70, y: 0.40 },
      { kind: 'pearls', color: '#FFFFFF', x: 0.40, y: 0.65 },
      { kind: 'pearls', color: '#FFFFFF', x: 0.55, y: 0.65 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 3100, tags: ['Wedding'] },

  // — Burning Cakes 🔥 (signature trend, LE 600) —
  { id: 'burning-classic', name: 'Burning Classic', collection: 'Burning Cakes', occasion: 'birthday-adults', theme: 'velvet',
    shape: 'round', tiers: 1, frostColor: '#2A1A18', toppingColor: '#E35F40',
    toppings: [
      { kind: 'sprinkles', color: '#E35F40', x: 0.30, y: 0.40 },
      { kind: 'sprinkles', color: '#FFDC4A', x: 0.50, y: 0.32 },
      { kind: 'sprinkles', color: '#E35F40', x: 0.70, y: 0.40 },
      { kind: 'hearts', color: '#FFDC4A', x: 0.50, y: 0.55 },
    ],
    flavor: 'chocolate-ganache', basePrice: 600, tags: ['New', '🔥'] },
  { id: 'burning-pink', name: 'Burning Pink', collection: 'Burning Cakes', occasion: 'valentines', theme: 'heart',
    shape: 'heart', tiers: 1, frostColor: '#FFBFBE', toppingColor: '#E35F40',
    toppings: [
      { kind: 'hearts', color: '#E35F40', x: 0.50, y: 0.42 },
      { kind: 'hearts', color: '#6B0F1A', x: 0.35, y: 0.55 },
      { kind: 'hearts', color: '#6B0F1A', x: 0.65, y: 0.55 },
    ],
    flavor: 'red-velvet', basePrice: 600, tags: ['New', '🔥'] },

  // — Additional Buttercream Madness (LE 1,200) —
  { id: 'cheers-celebration', name: 'Cheers Celebration', collection: 'Buttercream Madness', occasion: 'birthday-adults', theme: 'aesthetic',
    shape: 'round', tiers: 1, frostColor: '#FCF8EF', toppingColor: '#FFDC4A',
    toppings: [
      { kind: 'sprinkles', color: '#FFDC4A', x: 0.30, y: 0.40 },
      { kind: 'sprinkles', color: '#E35F40', x: 0.50, y: 0.32 },
      { kind: 'sprinkles', color: '#7FB0E7', x: 0.70, y: 0.40 },
      { kind: 'flowers', color: '#FFDC4A', x: 0.50, y: 0.58 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 1200, tags: ['Most loved'] },
  { id: 'pastel-bloom', name: 'Pastel Bloom', collection: 'Buttercream Madness', occasion: 'birthday-adults', theme: 'aesthetic',
    shape: 'round', tiers: 1, frostColor: '#FFE4E2', toppingColor: '#FFBFBE',
    toppings: [
      { kind: 'flowers', color: '#FFBFBE', x: 0.30, y: 0.40 },
      { kind: 'flowers', color: '#A8D5BA', x: 0.50, y: 0.32 },
      { kind: 'flowers', color: '#7FB0E7', x: 0.70, y: 0.40 },
    ],
    flavor: 'vanilla-raspberry', basePrice: 1200, tags: [] },
  { id: 'dirty-thirty', name: 'Dirty Thirty', collection: 'Buttercream Madness', occasion: 'birthday-adults', theme: 'velvet',
    shape: 'number', tiers: 1, frostColor: '#FCF8EF', toppingColor: '#2A1A18',
    toppings: [
      { kind: 'sprinkles', color: '#2A1A18', x: 0.40, y: 0.40 },
      { kind: 'sprinkles', color: '#2A1A18', x: 0.60, y: 0.40 },
    ],
    flavor: 'chocolate-ganache', basePrice: 1400, message: 'dirty 30', tags: ['Milestone'] },

  // — Additional Drip It Like Its Hot —
  { id: 'golden-wave', name: 'Golden Wave Floral', collection: 'Drip It Like Its Hot', occasion: 'birthday-adults', theme: 'aesthetic',
    shape: 'round', tiers: 1, frostColor: '#FCF8EF', toppingColor: '#FFDC4A',
    toppings: [
      { kind: 'flowers', color: '#FFDC4A', x: 0.30, y: 0.42 },
      { kind: 'flowers', color: '#FFE4E2', x: 0.50, y: 0.32 },
      { kind: 'flowers', color: '#FFDC4A', x: 0.70, y: 0.42 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 1200, tags: [] },

  // — Additional Animal Lovers —
  { id: 'animal-farm', name: 'Animal Farm', collection: 'Animal Lovers', occasion: 'birthday-kids', theme: 'dinosaur',
    shape: 'round', tiers: 1, frostColor: '#A8D5BA', toppingColor: '#FFDC4A',
    toppings: [
      { kind: 'flowers', color: '#FFDC4A', x: 0.30, y: 0.40 },
      { kind: 'flowers', color: '#E35F40', x: 0.50, y: 0.32 },
      { kind: 'flowers', color: '#FFDC4A', x: 0.70, y: 0.40 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 1200, tags: ['Kids'] },
  { id: 'ice-cream-lover', name: 'Ice Cream Lover', collection: 'Animal Lovers', occasion: 'birthday-kids', theme: 'princess',
    shape: 'round', tiers: 1, frostColor: '#FFE4E2', toppingColor: '#FFBFBE',
    toppings: [
      { kind: 'sprinkles', color: '#7FB0E7', x: 0.30, y: 0.40 },
      { kind: 'sprinkles', color: '#FFDC4A', x: 0.50, y: 0.32 },
      { kind: 'sprinkles', color: '#E35F40', x: 0.70, y: 0.40 },
    ],
    flavor: 'cookies-and-cream', basePrice: 1200, tags: ['Kids'] },

  // — Additional Flower Power —
  { id: 'floral-drip', name: 'Floral Drip', collection: 'Flower Power', occasion: 'birthday-adults', theme: 'garden',
    shape: 'round', tiers: 1, frostColor: '#FFBFBE', toppingColor: '#6B0F1A',
    toppings: [
      { kind: 'flowers', color: '#6B0F1A', x: 0.30, y: 0.40 },
      { kind: 'flowers', color: '#FFDC4A', x: 0.50, y: 0.32 },
      { kind: 'flowers', color: '#6B0F1A', x: 0.70, y: 0.40 },
    ],
    flavor: 'vanilla-strawberry', basePrice: 1200, tags: [] },

  // — Additional Selfie Cakes —
  { id: 'selfie-heart', name: 'Selfie Heart', collection: 'Selfie Cakes', occasion: 'valentines', theme: 'heart',
    shape: 'heart', tiers: 1, frostColor: '#FFBFBE', toppingColor: '#E35F40',
    toppings: [
      { kind: 'hearts', color: '#E35F40', x: 0.20, y: 0.30 },
      { kind: 'hearts', color: '#E35F40', x: 0.80, y: 0.30 },
    ],
    flavor: 'red-velvet', basePrice: 1500, tags: ['Photo', 'Romantic'] },

  // — Additional Marvel Fans —
  { id: 'spidy-spiderman', name: 'Spidy Spider-Man', collection: 'Marvel Fans', occasion: 'birthday-kids', theme: 'superhero',
    shape: 'round', tiers: 1, frostColor: '#3D5A99', toppingColor: '#E35F40',
    toppings: [{ kind: 'hearts', color: '#E35F40', x: 0.50, y: 0.45 }],
    flavor: 'chocolate-ganache', basePrice: 1200, tags: ['Kids', 'Character'] },
];

const COLLECTION_FILTERS = [
  { id: 'all',                  label: 'All' },
  { id: 'Bento Cake',           label: 'Bento' },
  { id: 'Burning Cakes',        label: 'Burning 🔥' },
  { id: 'Buttercream Madness',  label: 'Buttercream' },
  { id: 'Drip It Like Its Hot', label: 'Drip' },
  { id: 'Animal Lovers',        label: 'Animal' },
  { id: 'Flower Power',         label: 'Floral' },
  { id: 'Selfie Cakes',         label: 'Selfie' },
  { id: 'Marvel Fans',          label: 'Marvel' },
  { id: 'Food Mania',           label: 'Food Mania' },
  { id: 'Celebrating Occasions',label: 'Occasions' },
];

function CatalogView({ onPick, onBack }) {
  const [filter, setFilter] = useStateC('all');
  const filtered = useMemoC(() => filter === 'all'
    ? PRESETS
    : PRESETS.filter(p => p.collection === filter), [filter]);

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        marginBottom: 24, gap: 24 }}>
        <div>
          <Caption style={{ marginBottom: 8 }}>Shop a design</Caption>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 48, lineHeight: 1.05,
            color: 'var(--ninos-ink)', margin: 0, fontWeight: 400,
            textTransform: 'none', letterSpacing: '-0.02em',
          }}>
            cakes we already <ScriptAccent style={{ fontSize: 56, color: 'var(--ninos-burgundy)' }}>love</ScriptAccent>
          </h1>
          <p style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic',
            fontSize: 16, color: 'var(--ninos-graphite)', marginTop: 8, maxWidth: 520 }}>
            tap any to tweak color, message, size and flavor — your way, in a minute.
          </p>
        </div>
        <SecondaryButton onClick={onBack}>
          <Icon name="chevron-left" size={14}/> Back
        </SecondaryButton>
      </div>

      {/* Collection chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
        {COLLECTION_FILTERS.map(f => {
          const active = filter === f.id;
          const count = f.id === 'all' ? PRESETS.length : PRESETS.filter(p => p.collection === f.id).length;
          if (count === 0) return null;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '8px 16px', borderRadius: 999,
              background: active ? 'var(--ninos-ink)' : '#fff',
              color: active ? 'var(--ninos-cream)' : 'var(--ninos-ink)',
              border: active ? 0 : '1px solid var(--border-soft)',
              fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 600,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'all 220ms var(--ease-frosting)',
            }}>
              {f.label}
              <span style={{
                fontSize: 10, opacity: 0.55,
                background: active ? 'rgba(255,255,255,0.18)' : 'var(--ninos-pink-50)',
                padding: '1px 7px', borderRadius: 999,
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 20,
      }}>
        {filtered.map(p => (
          <PresetCard key={p.id} preset={p} onPick={() => onPick(p)}/>
        ))}
      </div>
    </div>
  );
}

function PresetCard({ preset, onPick }) {
  const [hover, setHover] = useStateC(false);
  return (
    <button
      onClick={onPick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff',
        border: '1px solid var(--border-soft)',
        borderRadius: 24, padding: 0, cursor: 'pointer',
        textAlign: 'left', overflow: 'hidden',
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        transform: hover ? 'translateY(-3px)' : 'none',
        transition: 'all 280ms var(--ease-frosting)',
        display: 'flex', flexDirection: 'column',
      }}>
      <div style={{
        height: 220, background: 'var(--ninos-paper)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 75%, var(--ninos-pink-100) 0%, transparent 60%)',
        }}/>
        <div style={{ transform: 'scale(0.6) translateY(20px)' }}>
          <CakeRender
            style="illustrated"
            shape={preset.shape}
            size={1}
            frostColor={preset.frostColor}
            toppingsArr={preset.toppings}
            toppingColor={preset.toppingColor}
            message={preset.message || ''}
            tiers={preset.tiers}
            rotation={0}
            zoom={1}
            scale={1}
          />
        </div>
        {preset.tags && preset.tags[0] && (
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: preset.tags[0] === 'Bestseller' ? 'var(--ninos-butter)'
              : preset.tags[0] === 'Most loved' ? 'var(--ninos-salmon)'
              : '#fff',
            color: preset.tags[0] === 'Bestseller' ? '#3d2400'
              : preset.tags[0] === 'Most loved' ? '#fff'
              : 'var(--ninos-ink)',
            padding: '4px 10px', borderRadius: 999,
            fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            boxShadow: 'var(--shadow-xs)',
          }}>{preset.tags[0]}</div>
        )}
        <div style={{
          position: 'absolute', bottom: 14, left: 14,
          background: 'rgba(252,248,239,0.86)', backdropFilter: 'blur(8px)',
          padding: '3px 10px', borderRadius: 999,
          fontFamily: 'var(--font-heading)', fontSize: 9, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--ninos-graphite)',
        }}>{preset.collection}</div>
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22,
            color: 'var(--ninos-ink)', lineHeight: 1.1 }}>{preset.name}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14,
            color: 'var(--ninos-ink)' }}>EGP {preset.basePrice}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic',
          fontSize: 13, color: 'var(--ninos-stone)', marginTop: 4 }}>
          {preset.tiers} tier{preset.tiers > 1 ? 's' : ''} · {preset.shape} · {preset.toppings.length} toppings
        </div>
        <div style={{
          marginTop: 12, padding: '8px 12px', borderRadius: 999,
          background: hover ? 'var(--ninos-salmon)' : 'var(--ninos-cream)',
          color: hover ? '#fff' : 'var(--ninos-burgundy)',
          fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          transition: 'all 220ms',
        }}>
          <Icon name="edit" size={11}/> Customize
        </div>
      </div>
    </button>
  );
}

// === Inspo upload flow ===
function InspoFlow({ onContinue, onBack }) {
  const [file, setFile] = useStateC(null);
  const [stage, setStage] = useStateC('upload');
  const [approximation, setApproximation] = useStateC(null);
  const inputRef = React.useRef(null);

  function handleFile(f) {
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFile({ url, name: f.name });
    setStage('analyzing');
    setTimeout(() => {
      const guess = {
        shape: 'round', tiers: 2,
        frostColor: '#FFBFBE',
        toppingColor: '#E35F40',
        toppings: [
          { kind: 'hearts',  color: '#E35F40', x: 0.30, y: 0.40 },
          { kind: 'hearts',  color: '#E35F40', x: 0.50, y: 0.32 },
          { kind: 'hearts',  color: '#E35F40', x: 0.70, y: 0.40 },
          { kind: 'flowers', color: '#FFDC4A', x: 0.40, y: 0.62 },
          { kind: 'flowers', color: '#FFDC4A', x: 0.60, y: 0.62 },
        ],
        confidence: 78,
      };
      setApproximation(guess);
      setStage('preview');
    }, 2200);
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <Caption style={{ marginBottom: 8 }}>From your inspiration</Caption>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 48, lineHeight: 1.05,
            color: 'var(--ninos-ink)', margin: 0, fontWeight: 400,
            textTransform: 'none', letterSpacing: '-0.02em',
          }}>
            show us your <ScriptAccent style={{ fontSize: 56, color: 'var(--ninos-burgundy)' }}>inspo</ScriptAccent>
          </h1>
          <p style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic',
            fontSize: 16, color: 'var(--ninos-graphite)', marginTop: 8, maxWidth: 540 }}>
            drop a photo, a pinterest screenshot, anything — we'll approximate it as a 3D model you can tune.
          </p>
        </div>
        <SecondaryButton onClick={onBack}>
          <Icon name="chevron-left" size={14}/> Back
        </SecondaryButton>
      </div>

      <input ref={inputRef} type="file" accept="image/*" hidden
        onChange={(e) => handleFile(e.target.files && e.target.files[0])}/>

      {stage === 'upload' && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current.click()}
          style={{
            border: '2px dashed var(--ninos-mist)',
            borderRadius: 28, padding: '80px 40px',
            background: 'var(--ninos-paper)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 16,
            cursor: 'pointer',
            transition: 'all 280ms var(--ease-frosting)',
          }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--ninos-pink-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="upload" size={32} color="var(--ninos-salmon)"/>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 26,
            color: 'var(--ninos-ink)', textTransform: 'none', fontWeight: 400,
            letterSpacing: '-0.01em', margin: 0,
          }}>drop a photo here</h2>
          <p style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic',
            fontSize: 14, color: 'var(--ninos-stone)', textAlign: 'center', maxWidth: 380 }}>
            or click to browse. jpg, png, heic — we'll do our best.
          </p>
        </div>
      )}

      {stage === 'analyzing' && file && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center',
          padding: '40px 0',
        }}>
          <img src={file.url} alt="" style={{
            width: '100%', height: 380, objectFit: 'cover', borderRadius: 24,
            boxShadow: 'var(--shadow-md)',
          }}/>
          <div>
            <Caption style={{ marginBottom: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                border: '2px solid var(--ninos-salmon)',
                borderTopColor: 'transparent',
                animation: 'spin 0.9s linear infinite',
              }}/>
              Analyzing your reference
            </Caption>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 32,
              color: 'var(--ninos-ink)', textTransform: 'none', fontWeight: 400,
              letterSpacing: '-0.01em', margin: 0, lineHeight: 1.1,
            }}>reading the <ScriptAccent style={{ fontSize: 36 }}>shape</ScriptAccent>,<br/>colors, and toppings…</h2>
          </div>
        </div>
      )}

      {stage === 'preview' && approximation && file && (
        <div style={{ animation: 'float-up 480ms var(--ease-frosting)' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch',
          }}>
            <div style={{ position: 'relative' }}>
              <Caption style={{ position: 'absolute', top: 16, left: 16, zIndex: 5,
                background: 'rgba(252,248,239,0.92)', padding: '4px 10px', borderRadius: 999 }}>
                Your reference
              </Caption>
              <img src={file.url} alt="" style={{
                width: '100%', height: 420, objectFit: 'cover', borderRadius: 24,
                boxShadow: 'var(--shadow-md)',
              }}/>
            </div>
            <div style={{
              position: 'relative', borderRadius: 24, overflow: 'hidden',
              background: 'var(--ninos-cream)', height: 420,
              boxShadow: 'var(--shadow-md)',
            }}>
              <Caption style={{ position: 'absolute', top: 16, left: 16, zIndex: 5,
                background: 'rgba(252,248,239,0.92)', padding: '4px 10px', borderRadius: 999 }}>
                Our approximation
              </Caption>
              <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 5,
                background: 'var(--ninos-teal)', color: '#fff',
                padding: '4px 10px', borderRadius: 999,
                fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>{approximation.confidence}% match</div>
              <CakeStage
                cake={{...approximation, sizeIdx: 2}}
                background="cream"
                renderStyle="illustrated"
                height={420}
                showHints={false}
              />
            </div>
          </div>
          <div style={{
            marginTop: 24, padding: '20px 24px',
            background: 'var(--bg-card-warm)', borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
          }}>
            <div>
              <Caption>What we read</Caption>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 500,
                color: 'var(--ninos-ink)', marginTop: 4 }}>
                {approximation.tiers}-tier {approximation.shape} · {approximation.toppings.length} toppings · pink-and-salmon palette
              </div>
              <div style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic',
                fontSize: 13, color: 'var(--ninos-stone)', marginTop: 4 }}>
                tune anything in the builder before checking out.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <SecondaryButton onClick={() => { setStage('upload'); setFile(null); }}>
                <Icon name="rotate" size={14}/> Try another
              </SecondaryButton>
              <PrimaryButton onClick={() => onContinue(approximation, file)}>
                Looks close — tune it
                <Icon name="arrow-right" size={16}/>
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Landing screen — 4 entry points + one-stop-shop teaser ===
function Landing({ onShop, onBuild, onInspo, onStudio }) {
  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', padding: '60px 32px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <Caption style={{ marginBottom: 14 }}>made for the moments worth marking</Caption>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 80, lineHeight: 1,
          color: 'var(--ninos-ink)', margin: 0, fontWeight: 400,
          textTransform: 'none', letterSpacing: '-0.025em',
        }}>
          design your cake.<br/>
          <ScriptAccent style={{ fontSize: 96, color: 'var(--ninos-salmon)' }}>complete</ScriptAccent>{' '}
          your celebration.
        </h1>
        <p style={{
          fontFamily: 'var(--font-italic)', fontStyle: 'italic',
          fontSize: 18, color: 'var(--ninos-graphite)',
          marginTop: 20, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto',
        }}>
          one stop, one delivery. cake, candles, cupcakes, balloons and party supplies — in one order.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <EntryCard tone="pink"   eyebrow="The fastest path"
          title="Shop a design" sub="60+ designs we already make. Tweak color, message, size in one minute."
          stat="Most chosen" onClick={onShop}/>
        <EntryCard tone="salmon" eyebrow="Make it yours" featured
          title="Build your own" sub="10 steps. Watch a 3D render update with every choice you make."
          stat="The hero" onClick={onBuild}/>
        <EntryCard tone="butter" eyebrow="Drag-and-drop"
          title="3D Studio" sub="Pro mode. Stack tiers, drop candles, ribbons, roses, donuts. Full freedom."
          stat="New" onClick={onStudio}/>
        <EntryCard tone="paper"  eyebrow="Saw something on Pinterest?"
          title="From a photo" sub="Upload a reference. We approximate it as a 3D cake you can fine-tune."
          stat="" onClick={onInspo}/>
      </div>

      {/* One-stop-shop teaser */}
      <div style={{
        marginTop: 48, padding: '32px 36px',
        background: 'var(--bg-card-warm)', borderRadius: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Caption>One delivery, everything you need</Caption>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1.05,
            color: 'var(--ninos-ink)', margin: '8px 0 8px', fontWeight: 400,
            textTransform: 'none', letterSpacing: '-0.01em',
          }}>
            <ScriptAccent style={{ fontSize: 38, color: 'var(--ninos-burgundy)' }}>nino's</ScriptAccent> is your party in one box.
          </h3>
          <p style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic',
            fontSize: 14, color: 'var(--ninos-graphite)', margin: 0, maxWidth: 500 }}>
            add cupcakes, cake pops, cookies, candles, toppers, balloons, plates and cutlery to any order — we bring it all together.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap',
          maxWidth: 380, justifyContent: 'flex-end', alignItems: 'center', rowGap: 8 }}>
          {['Cupcakes', 'Cake Pops', 'Cookies', 'Candles', 'Toppers', 'Balloons', 'Plates'].map((label) => (
            <div key={label} style={{
              padding: '8px 14px', background: '#fff',
              borderRadius: 999, boxShadow: 'var(--shadow-xs)',
              fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              color: 'var(--ninos-ink)',
              whiteSpace: 'nowrap',
            }}>{label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EntryCard({ tone, eyebrow, title, sub, stat, featured, onClick }) {
  const [hover, setHover] = useStateC(false);
  const bg = tone === 'salmon' ? 'var(--ninos-salmon)'
    : tone === 'butter' ? 'var(--ninos-butter)'
    : tone === 'pink' ? 'var(--ninos-pink-100)'
    : 'var(--ninos-paper)';
  const fg = tone === 'salmon' ? 'var(--ninos-cream)' : 'var(--ninos-ink)';
  const meta = tone === 'salmon' ? 'rgba(252,248,239,0.7)' : 'var(--ninos-stone)';
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: bg, color: fg,
        border: 0, padding: 28, borderRadius: 28,
        cursor: 'pointer', textAlign: 'left',
        minHeight: 360, position: 'relative', overflow: 'hidden',
        boxShadow: featured ? 'var(--shadow-glow-salmon)' : 'var(--shadow-sm)',
        transform: hover ? 'translateY(-4px)' : 'none',
        transition: 'all 320ms var(--ease-frosting)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        fontFamily: 'var(--font-body)',
      }}>
      <div style={{
        position: 'absolute', right: -20, bottom: -20,
        width: 180, height: 180,
        background: tone === 'salmon'
          ? 'radial-gradient(circle, rgba(255,220,74,0.4), transparent 70%)'
          : 'radial-gradient(circle, rgba(227,95,64,0.18), transparent 70%)',
        pointerEvents: 'none',
      }}/>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Caption style={{ color: meta }}>{eyebrow}</Caption>
          {stat && (
            <div style={{
              background: tone === 'salmon' ? 'var(--ninos-butter)' : '#fff',
              color: tone === 'salmon' ? '#3d2400' : 'var(--ninos-burgundy)',
              padding: '4px 10px', borderRadius: 999,
              fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>{stat}</div>
          )}
        </div>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 34, lineHeight: 1.05,
          margin: '18px 0 10px', textTransform: 'none', fontWeight: 400,
          letterSpacing: '-0.01em', color: fg,
        }}>{title}</h3>
        <p style={{
          fontFamily: 'var(--font-italic)', fontStyle: 'italic',
          fontSize: 14, color: tone === 'salmon' ? 'rgba(252,248,239,0.86)' : 'var(--ninos-graphite)',
          margin: 0, maxWidth: 260,
        }}>{sub}</p>
      </div>
      <div style={{
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20,
        fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase',
        color: fg,
      }}>
        Start
        <span style={{
          width: 28, height: 28, borderRadius: '50%',
          background: tone === 'salmon' ? 'var(--ninos-cream)' : 'var(--ninos-ink)',
          color: tone === 'salmon' ? 'var(--ninos-salmon)' : 'var(--ninos-cream)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transform: hover ? 'translateX(4px)' : 'none',
          transition: 'transform 220ms var(--ease-frosting)',
        }}>
          <Icon name="arrow-right" size={14}/>
        </span>
      </div>
    </button>
  );
}

Object.assign(window, {
  PRESETS, CatalogView, InspoFlow, Landing,
});
