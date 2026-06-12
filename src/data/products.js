/* ============================================
   CIGGY — Product Data
   
   TO ADD A NEW PRODUCT: Copy one product object,
   change the id, and fill in the fields.
   
   Fields:
   - id: unique string (used in URL)
   - name: product name
   - category: one of "Tees" | "Shirts" | "Outerwear" | "Polos" | "Accessories"
   - price: number in INR (no ₹ symbol, just the number)
   - color: color name string
   - sizes: array of available sizes
   - description: short product description
   - details: array of product detail bullet points
   - care: array of care instruction strings
   - tagline: short product tagline shown on card
   ============================================ */

export const PRODUCTS = [
  {
    id: 'panel-tee-01',
    name: 'Panel Tee 01',
    category: 'Tees',
    price: 1499,
    color: 'Washed Charcoal',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Heavy tee. Boxy shape. Panel seam at the front. No outside label.',
    tagline: 'Heavy. Boxy. Panel front.',
    details: [
      'Heavyweight cotton',
      'Boxy fit, drop shoulder',
      'Panel seam at chest',
      'Inside neck label only',
    ],
    care: [
      'Machine wash cold, gentle cycle',
      'Do not bleach',
      'Tumble dry low',
      'Iron on low if needed',
    ],
  },
  {
    id: 'utility-smock-01',
    name: 'Utility Smock 01',
    category: 'Outerwear',
    price: 2999,
    color: 'Faded Black',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'A relaxed layer with proper pockets and nothing extra on the outside.',
    tagline: 'Relaxed fit. Real pockets.',
    details: [
      'Utility pocket, structured',
      'Relaxed fit',
      'No outside branding',
      'Good for everyday layering',
    ],
    care: [
      'Machine wash cold',
      'Do not bleach',
      'Hang dry',
      'Iron on low',
    ],
  },
  {
    id: 'ripstop-shell-01',
    name: 'Ripstop Shell 01',
    category: 'Outerwear',
    price: 3499,
    color: 'Charcoal',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Light shell jacket. Ripstop fabric. Mesh lining. Keeps the weather out.',
    tagline: 'Light shell. Ripstop fabric.',
    details: [
      'Ripstop outer fabric',
      'Lightweight',
      'Mesh lining',
      'Minimal branding',
    ],
    care: [
      'Machine wash cold, gentle cycle',
      'Do not bleach or iron',
      'Hang dry only',
    ],
  },
  {
    id: 'core-polo-01',
    name: 'Core Polo 01',
    category: 'Polos',
    price: 1899,
    color: 'Deep Navy / Petrol Detail',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'A polo that fits right. Structured collar, clean placket, side vents.',
    tagline: 'Structured collar. Side vents.',
    details: [
      'Structured collar',
      'Clean placket',
      'Side vent at hem',
      'No surface decoration',
    ],
    care: [
      'Machine wash cold',
      'Do not bleach',
      'Tumble dry low',
      'Iron on low if needed',
    ],
  },
]

/* 
  FUTURE PRODUCTS: Add more product objects here following the same structure.
  The shop page filters and search will automatically pick up new entries.
*/

export const CATEGORIES = ['All', 'Tees', 'Shirts', 'Outerwear', 'Polos', 'Accessories']

export const getProductById = (id) => PRODUCTS.find((p) => p.id === id)

export const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`
