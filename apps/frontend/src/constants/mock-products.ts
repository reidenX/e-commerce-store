import { Product } from '@/types'

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '8a4aa606-31d5-4884-aaeb-81ee1211a8b4',
    name: 'CyberTruck',
    description:
      'Futuristic electric utility vehicle with an exoskeleton design and armored glass.',
    price: 10000000, // $100,000.00 represented in minor units
    image:
      'https://images.unsplash.com/photo-1727994527246-68e26082d0fd?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Vehicles',
    isFeatured: true,
    stock: 0, // Testing our Out-of-Stock logic wrapper
  },
  {
    id: '2b9bb707-42e6-5995-bbff-92ff2322b9c5',
    name: 'Developer Mechanical Keyboard',
    description:
      'Hot-swappable tactile switches with custom PBT key caps and programmable macro mapping layers.',
    price: 15000, // $150.00
    image:
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Electronics',
    isFeatured: false,
    stock: 12, // Testing available stock layout
  },
  {
    id: '3c0cc808-53f7-6aa6-ccaa-03aa3433c0d6',
    name: 'Minimalist Leather Backpack',
    description:
      'Water-resistant commuter pack with a dedicated laptop compartment and hidden travel pockets.',
    price: 8500, // $85.00
    image:
      'https://images.unsplash.com/photo-1577733975197-3b950ca5cabe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Apparel',
    isFeatured: false,
    stock: 5,
  },
]
