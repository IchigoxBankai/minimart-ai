// MiniMart AI - Unified Data Store Engine (LocalStorage + Reactive Event Emitter + Firestore-ready)

const STORAGE_PREFIX = 'minimart_store_';
const STORES_LIST_KEY = 'minimart_all_stores';

// High quality retail product image URLs
const IMAGES = {
  coke: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80',
  pepsi: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=80',
  juice: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop&q=80',
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
  butter: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&auto=format&fit=crop&q=80',
  bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
  lays: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=80',
  kurkure: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&auto=format&fit=crop&q=80',
  noodles: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80',
  biscuits: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80',
  salt: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&auto=format&fit=crop&q=80',
  atta: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
  surf: 'https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?w=400&auto=format&fit=crop&q=80',
  dishwash: 'https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?w=400&auto=format&fit=crop&q=80',
  dettol: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
  shampoo: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=80',
};

// Generate realistic past dates
const daysAgo = (days, hours = 0, mins = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours, d.getMinutes() - mins);
  return d.toISOString();
};

export const DEMO_STORE_ID = 'demo-store-dailybasket';

export const getInitialDemoData = () => {
  const products = [
    {
      id: 'prod-001',
      name: 'Coca-Cola 750ml',
      sku: 'BEV-CC-750',
      category: 'Beverages',
      description: 'Refreshing carbonated soft drink bottle 750ml',
      sellingPrice: 40,
      costPrice: 28,
      stock: 8,
      reorderLevel: 25,
      supplier: 'Hindustan Coca-Cola Beverages',
      imageUrl: IMAGES.coke,
      isActive: true,
      salesVelocity: 6.2, // sold per day
      createdAt: daysAgo(45),
    },
    {
      id: 'prod-002',
      name: 'Pepsi 750ml',
      sku: 'BEV-PEP-750',
      category: 'Beverages',
      description: 'Chilled Pepsi cola pet bottle 750ml',
      sellingPrice: 40,
      costPrice: 27,
      stock: 22,
      reorderLevel: 15,
      supplier: 'Varun Beverages Ltd',
      imageUrl: IMAGES.pepsi,
      isActive: true,
      salesVelocity: 4.8,
      createdAt: daysAgo(45),
    },
    {
      id: 'prod-003',
      name: 'Tropicana Orange Juice 1L',
      sku: 'BEV-TROP-1L',
      category: 'Beverages',
      description: '100% Real orange fruit juice tetra pack 1L',
      sellingPrice: 120,
      costPrice: 90,
      stock: 14,
      reorderLevel: 10,
      supplier: 'PepsiCo India',
      imageUrl: IMAGES.juice,
      isActive: true,
      salesVelocity: 2.1,
      createdAt: daysAgo(40),
    },
    {
      id: 'prod-004',
      name: 'Britannia Whole Wheat Bread',
      sku: 'BAK-BRIT-400',
      category: 'Bakery',
      description: '100% Whole wheat bread loaf with grains 400g',
      sellingPrice: 50,
      costPrice: 35,
      stock: 4,
      reorderLevel: 15,
      supplier: 'Britannia Industries',
      imageUrl: IMAGES.bread,
      isActive: true,
      salesVelocity: 5.4,
      createdAt: daysAgo(50),
    },
    {
      id: 'prod-005',
      name: 'Amul Butter 500g',
      sku: 'DAI-AMUL-500',
      category: 'Dairy',
      description: 'Pasteurized salted butter pack 500g',
      sellingPrice: 275,
      costPrice: 235,
      stock: 9,
      reorderLevel: 12,
      supplier: 'Gujarat Cooperative Milk Marketing (GCMMF)',
      imageUrl: IMAGES.butter,
      isActive: true,
      salesVelocity: 3.1,
      createdAt: daysAgo(50),
    },
    {
      id: 'prod-006',
      name: 'Amul Taaza Milk 1L',
      sku: 'DAI-MILK-1L',
      category: 'Dairy',
      description: 'Fresh toned pasteurized milk pouch 1L',
      sellingPrice: 56,
      costPrice: 48,
      stock: 3,
      reorderLevel: 15,
      supplier: 'Amul Dairy Local Depot',
      imageUrl: IMAGES.milk,
      isActive: true,
      salesVelocity: 7.5,
      createdAt: daysAgo(60),
    },
    {
      id: 'prod-007',
      name: "Lay's Classic Salted 50g",
      sku: 'SNK-LAYS-50',
      category: 'Snacks',
      description: 'Crispy salted potato chips pack 50g',
      sellingPrice: 20,
      costPrice: 14,
      stock: 11,
      reorderLevel: 25,
      supplier: 'PepsiCo Snacks Distribution',
      imageUrl: IMAGES.lays,
      isActive: true,
      salesVelocity: 4.5,
      createdAt: daysAgo(40),
    },
    {
      id: 'prod-008',
      name: 'Kurkure Masala Munch 90g',
      sku: 'SNK-KURK-90',
      category: 'Snacks',
      description: 'Spicy crispy puffcorn snacks pack 90g',
      sellingPrice: 20,
      costPrice: 13.5,
      stock: 34,
      reorderLevel: 20,
      supplier: 'PepsiCo Snacks Distribution',
      imageUrl: IMAGES.kurkure,
      isActive: true,
      salesVelocity: 5.1,
      createdAt: daysAgo(40),
    },
    {
      id: 'prod-009',
      name: 'Maggi 2-Minute Noodles 4-Pack',
      sku: 'GRO-MAGG-4PK',
      category: 'Grocery',
      description: 'Instant masala noodles multipack 280g',
      sellingPrice: 58,
      costPrice: 44,
      stock: 28,
      reorderLevel: 15,
      supplier: 'Nestlé India Distribution',
      imageUrl: IMAGES.noodles,
      isActive: true,
      salesVelocity: 6.0,
      createdAt: daysAgo(60),
    },
    {
      id: 'prod-010',
      name: 'Parle-G Gold Biscuits 250g',
      sku: 'SNK-PARLE-250',
      category: 'Snacks',
      description: 'Original glucose biscuits family value pack',
      sellingPrice: 30,
      costPrice: 21,
      stock: 45,
      reorderLevel: 20,
      supplier: 'Parle Products Pvt Ltd',
      imageUrl: IMAGES.biscuits,
      isActive: true,
      salesVelocity: 4.0,
      createdAt: daysAgo(60),
    },
    {
      id: 'prod-011',
      name: 'Tata Salt Vacuum Evaporated 1kg',
      sku: 'GRO-TATA-1KG',
      category: 'Grocery',
      description: 'Desh Ka Namak iodized cooking salt packet 1kg',
      sellingPrice: 28,
      costPrice: 20,
      stock: 38,
      reorderLevel: 15,
      supplier: 'Tata Consumer Products',
      imageUrl: IMAGES.salt,
      isActive: true,
      salesVelocity: 2.8,
      createdAt: daysAgo(60),
    },
    {
      id: 'prod-012',
      name: 'Aashirvaad Sharbati Atta 5kg',
      sku: 'GRO-AASH-5KG',
      category: 'Grocery',
      description: 'Premium whole wheat flour package 5kg',
      sellingPrice: 295,
      costPrice: 245,
      stock: 12,
      reorderLevel: 8,
      supplier: 'ITC Foods Limited',
      imageUrl: IMAGES.atta,
      isActive: true,
      salesVelocity: 1.8,
      createdAt: daysAgo(60),
    },
    {
      id: 'prod-013',
      name: 'Surf Excel Easy Wash Powder 1kg',
      sku: 'HOU-SURF-1KG',
      category: 'Household',
      description: 'High active laundry detergent washing powder 1kg',
      sellingPrice: 150,
      costPrice: 120,
      stock: 19,
      reorderLevel: 10,
      supplier: 'Hindustan Unilever Ltd',
      imageUrl: IMAGES.surf,
      isActive: true,
      salesVelocity: 1.6,
      createdAt: daysAgo(50),
    },
    {
      id: 'prod-014',
      name: 'Vim Dishwash Gel Lemon 500ml',
      sku: 'HOU-VIM-500',
      category: 'Household',
      description: 'Grease cleaning lemon liquid dishwash bottle 500ml',
      sellingPrice: 110,
      costPrice: 85,
      stock: 16,
      reorderLevel: 10,
      supplier: 'Hindustan Unilever Ltd',
      imageUrl: IMAGES.dishwash,
      isActive: true,
      salesVelocity: 1.4,
      createdAt: daysAgo(40),
    },
    {
      id: 'prod-015',
      name: 'Dettol Antiseptic Liquid 250ml',
      sku: 'PER-DETT-250',
      category: 'Personal Care',
      description: 'First aid and personal hygiene disinfectant 250ml',
      sellingPrice: 145,
      costPrice: 115,
      stock: 7,
      reorderLevel: 10,
      supplier: 'Reckitt Benckiser India',
      imageUrl: IMAGES.dettol,
      isActive: true,
      salesVelocity: 1.2,
      createdAt: daysAgo(50),
    },
    {
      id: 'prod-016',
      name: 'Dove Deep Moisture Shampoo 340ml',
      sku: 'PER-DOVE-340',
      category: 'Personal Care',
      description: 'Nutritive solutions nourishing hair shampoo 340ml',
      sellingPrice: 285,
      costPrice: 220,
      stock: 15,
      reorderLevel: 8,
      supplier: 'Hindustan Unilever Ltd',
      imageUrl: IMAGES.shampoo,
      isActive: true,
      salesVelocity: 1.1,
      createdAt: daysAgo(35),
    },
  ];

  const customers = [
    {
      id: 'cust-101',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98201 44321',
      totalOrders: 14,
      totalSpent: 4850,
      loyaltyPoints: 242,
      loyaltyTier: 'Silver',
      lastPurchaseDate: daysAgo(1, 2),
      status: 'Active',
      preferredCategories: ['Beverages', 'Snacks'],
      notes: 'Regular morning shopper. Prefers UPI payment.',
      createdAt: daysAgo(60),
    },
    {
      id: 'cust-102',
      name: 'Priya Patel',
      email: 'priya.p@example.com',
      phone: '+91 98450 11290',
      totalOrders: 22,
      totalSpent: 9640,
      loyaltyPoints: 482,
      loyaltyTier: 'Gold',
      lastPurchaseDate: daysAgo(0, 4),
      status: 'Active',
      preferredCategories: ['Dairy', 'Grocery', 'Bakery'],
      notes: 'VIP customer. Buys monthly ration.',
      createdAt: daysAgo(75),
    },
    {
      id: 'cust-103',
      name: 'Amit Verma',
      email: 'amit.verma92@example.com',
      phone: '+91 97110 33882',
      totalOrders: 9,
      totalSpent: 2780,
      loyaltyPoints: 139,
      loyaltyTier: 'Bronze',
      lastPurchaseDate: daysAgo(3, 5),
      status: 'Active',
      preferredCategories: ['Snacks', 'Beverages'],
      notes: 'Weekend buyer.',
      createdAt: daysAgo(40),
    },
    {
      id: 'cust-104',
      name: 'Sneha Deshmukh',
      email: 'sneha.d@example.com',
      phone: '+91 98920 77145',
      totalOrders: 18,
      totalSpent: 6420,
      loyaltyPoints: 321,
      loyaltyTier: 'Silver',
      lastPurchaseDate: daysAgo(2, 6),
      status: 'Active',
      preferredCategories: ['Dairy', 'Household'],
      notes: 'Family orders.',
      createdAt: daysAgo(65),
    },
    {
      id: 'cust-105',
      name: 'Karan Malhotra',
      email: 'karan.m@example.com',
      phone: '+91 99880 22411',
      totalOrders: 5,
      totalSpent: 1890,
      loyaltyPoints: 94,
      loyaltyTier: 'Bronze',
      lastPurchaseDate: daysAgo(32), // Inactive
      status: 'Inactive',
      preferredCategories: ['Beverages', 'Snacks'],
      notes: 'Has not visited in over 30 days.',
      createdAt: daysAgo(80),
    },
    {
      id: 'cust-106',
      name: 'Ananya Roy',
      email: 'ananya.roy@example.com',
      phone: '+91 98310 99422',
      totalOrders: 11,
      totalSpent: 3950,
      loyaltyPoints: 197,
      loyaltyTier: 'Bronze',
      lastPurchaseDate: daysAgo(38), // Inactive
      status: 'Inactive',
      preferredCategories: ['Personal Care', 'Dairy'],
      notes: 'Inactive customer - target with winback promo.',
      createdAt: daysAgo(90),
    },
    {
      id: 'cust-107',
      name: 'Vikram Joshi',
      email: 'vikram.j@example.com',
      phone: '+91 97690 12389',
      totalOrders: 3,
      totalSpent: 1250,
      loyaltyPoints: 62,
      loyaltyTier: 'Bronze',
      lastPurchaseDate: daysAgo(42), // Inactive
      status: 'Inactive',
      preferredCategories: ['Grocery'],
      notes: 'Lapsed user.',
      createdAt: daysAgo(100),
    },
    {
      id: 'cust-108',
      name: 'Meera Nambiar',
      email: 'meera.n@example.com',
      phone: '+91 98470 66532',
      totalOrders: 16,
      totalSpent: 7320,
      loyaltyPoints: 366,
      loyaltyTier: 'Silver',
      lastPurchaseDate: daysAgo(1, 8),
      status: 'Active',
      preferredCategories: ['Bakery', 'Dairy', 'Personal Care'],
      notes: 'Frequent buyer.',
      createdAt: daysAgo(55),
    },
    {
      id: 'cust-109',
      name: 'Rohan Gupta',
      email: 'rohan.g@example.com',
      phone: '+91 99100 88721',
      totalOrders: 2,
      totalSpent: 620,
      loyaltyPoints: 31,
      loyaltyTier: 'Bronze',
      lastPurchaseDate: daysAgo(0, 1),
      status: 'New',
      preferredCategories: ['Beverages'],
      notes: 'New local resident.',
      createdAt: daysAgo(3),
    },
    {
      id: 'cust-110',
      name: 'Deepika Rao',
      email: 'deepika.rao@example.com',
      phone: '+91 98800 44512',
      totalOrders: 8,
      totalSpent: 3100,
      loyaltyPoints: 155,
      loyaltyTier: 'Bronze',
      lastPurchaseDate: daysAgo(5, 3),
      status: 'Active',
      preferredCategories: ['Household', 'Grocery'],
      notes: 'Prefers card payment.',
      createdAt: daysAgo(45),
    },
  ];

  // Helper to generate realistic orders
  const orders = [
    {
      id: 'ORD-9842',
      customerId: 'cust-101',
      customerName: 'Rahul Sharma',
      items: [
        { productId: 'prod-001', name: 'Coca-Cola 750ml', price: 40, quantity: 2, cost: 28 },
        { productId: 'prod-007', name: "Lay's Classic Salted 50g", price: 20, quantity: 3, cost: 14 },
        { productId: 'prod-009', name: 'Maggi 2-Minute Noodles 4-Pack', price: 58, quantity: 1, cost: 44 },
      ],
      subtotal: 198,
      discount: 0,
      total: 198,
      paymentMethod: 'UPI',
      status: 'Completed',
      date: daysAgo(0, 1, 20),
      timeline: [
        { status: 'Order Placed', time: daysAgo(0, 1, 20) },
        { status: 'Payment Verified (UPI)', time: daysAgo(0, 1, 19) },
        { status: 'Completed', time: daysAgo(0, 1, 15) },
      ],
    },
    {
      id: 'ORD-9841',
      customerId: 'cust-102',
      customerName: 'Priya Patel',
      items: [
        { productId: 'prod-005', name: 'Amul Butter 500g', price: 275, quantity: 1, cost: 235 },
        { productId: 'prod-004', name: 'Britannia Whole Wheat Bread', price: 50, quantity: 2, cost: 35 },
        { productId: 'prod-006', name: 'Amul Taaza Milk 1L', price: 56, quantity: 2, cost: 48 },
        { productId: 'prod-012', name: 'Aashirvaad Sharbati Atta 5kg', price: 295, quantity: 1, cost: 245 },
      ],
      subtotal: 782,
      discount: 32,
      total: 750,
      paymentMethod: 'Card',
      status: 'Completed',
      date: daysAgo(0, 3, 10),
      timeline: [
        { status: 'Order Placed', time: daysAgo(0, 3, 10) },
        { status: 'Payment Confirmed', time: daysAgo(0, 3, 9) },
        { status: 'Completed', time: daysAgo(0, 3, 5) },
      ],
    },
    {
      id: 'ORD-9840',
      customerId: 'cust-109',
      customerName: 'Rohan Gupta',
      items: [
        { productId: 'prod-002', name: 'Pepsi 750ml', price: 40, quantity: 2, cost: 27 },
        { productId: 'prod-008', name: 'Kurkure Masala Munch 90g', price: 20, quantity: 2, cost: 13.5 },
      ],
      subtotal: 120,
      discount: 0,
      total: 120,
      paymentMethod: 'Cash',
      status: 'Completed',
      date: daysAgo(0, 5, 45),
      timeline: [
        { status: 'Order Placed', time: daysAgo(0, 5, 45) },
        { status: 'Completed', time: daysAgo(0, 5, 40) },
      ],
    },
    {
      id: 'ORD-9839',
      customerId: 'cust-104',
      customerName: 'Sneha Deshmukh',
      items: [
        { productId: 'prod-013', name: 'Surf Excel Easy Wash Powder 1kg', price: 150, quantity: 2, cost: 120 },
        { productId: 'prod-014', name: 'Vim Dishwash Gel Lemon 500ml', price: 110, quantity: 1, cost: 85 },
        { productId: 'prod-015', name: 'Dettol Antiseptic Liquid 250ml', price: 145, quantity: 1, cost: 115 },
      ],
      subtotal: 555,
      discount: 25,
      total: 530,
      paymentMethod: 'UPI',
      status: 'Processing',
      date: daysAgo(0, 6, 15),
      timeline: [
        { status: 'Order Placed', time: daysAgo(0, 6, 15) },
        { status: 'Processing Delivery', time: daysAgo(0, 5, 30) },
      ],
    },
    {
      id: 'ORD-9838',
      customerId: 'cust-108',
      customerName: 'Meera Nambiar',
      items: [
        { productId: 'prod-016', name: 'Dove Deep Moisture Shampoo 340ml', price: 285, quantity: 1, cost: 220 },
        { productId: 'prod-003', name: 'Tropicana Orange Juice 1L', price: 120, quantity: 2, cost: 90 },
      ],
      subtotal: 525,
      discount: 0,
      total: 525,
      paymentMethod: 'Card',
      status: 'Completed',
      date: daysAgo(1, 2, 10),
      timeline: [
        { status: 'Order Placed', time: daysAgo(1, 2, 10) },
        { status: 'Completed', time: daysAgo(1, 2, 5) },
      ],
    },
    {
      id: 'ORD-9837',
      customerId: 'cust-103',
      customerName: 'Amit Verma',
      items: [
        { productId: 'prod-001', name: 'Coca-Cola 750ml', price: 40, quantity: 4, cost: 28 },
        { productId: 'prod-007', name: "Lay's Classic Salted 50g", price: 20, quantity: 4, cost: 14 },
        { productId: 'prod-010', name: 'Parle-G Gold Biscuits 250g', price: 30, quantity: 2, cost: 21 },
      ],
      subtotal: 300,
      discount: 15,
      total: 285,
      paymentMethod: 'UPI',
      status: 'Completed',
      date: daysAgo(1, 6, 30),
      timeline: [
        { status: 'Order Placed', time: daysAgo(1, 6, 30) },
        { status: 'Completed', time: daysAgo(1, 6, 25) },
      ],
    },
    {
      id: 'ORD-9836',
      customerId: 'cust-110',
      customerName: 'Deepika Rao',
      items: [
        { productId: 'prod-011', name: 'Tata Salt Vacuum Evaporated 1kg', price: 28, quantity: 2, cost: 20 },
        { productId: 'prod-012', name: 'Aashirvaad Sharbati Atta 5kg', price: 295, quantity: 1, cost: 245 },
        { productId: 'prod-009', name: 'Maggi 2-Minute Noodles 4-Pack', price: 58, quantity: 2, cost: 44 },
      ],
      subtotal: 467,
      discount: 0,
      total: 467,
      paymentMethod: 'Card',
      status: 'Completed',
      date: daysAgo(2, 4, 15),
      timeline: [
        { status: 'Order Placed', time: daysAgo(2, 4, 15) },
        { status: 'Completed', time: daysAgo(2, 4, 10) },
      ],
    },
    {
      id: 'ORD-9835',
      customerId: 'cust-101',
      customerName: 'Rahul Sharma',
      items: [
        { productId: 'prod-001', name: 'Coca-Cola 750ml', price: 40, quantity: 3, cost: 28 },
        { productId: 'prod-008', name: 'Kurkure Masala Munch 90g', price: 20, quantity: 3, cost: 13.5 },
      ],
      subtotal: 180,
      discount: 0,
      total: 180,
      paymentMethod: 'UPI',
      status: 'Completed',
      date: daysAgo(2, 8, 45),
      timeline: [{ status: 'Completed', time: daysAgo(2, 8, 40) }],
    },
    {
      id: 'ORD-9834',
      customerId: 'cust-102',
      customerName: 'Priya Patel',
      items: [
        { productId: 'prod-006', name: 'Amul Taaza Milk 1L', price: 56, quantity: 4, cost: 48 },
        { productId: 'prod-004', name: 'Britannia Whole Wheat Bread', price: 50, quantity: 2, cost: 35 },
      ],
      subtotal: 324,
      discount: 14,
      total: 310,
      paymentMethod: 'UPI',
      status: 'Completed',
      date: daysAgo(3, 3, 20),
      timeline: [{ status: 'Completed', time: daysAgo(3, 3, 15) }],
    },
    {
      id: 'ORD-9833',
      customerId: 'cust-104',
      customerName: 'Sneha Deshmukh',
      items: [
        { productId: 'prod-015', name: 'Dettol Antiseptic Liquid 250ml', price: 145, quantity: 2, cost: 115 },
      ],
      subtotal: 290,
      discount: 0,
      total: 290,
      paymentMethod: 'Cash',
      status: 'Pending',
      date: daysAgo(3, 9, 0),
      timeline: [{ status: 'Order Placed', time: daysAgo(3, 9, 0) }],
    },
    {
      id: 'ORD-9832',
      customerId: 'cust-108',
      customerName: 'Meera Nambiar',
      items: [
        { productId: 'prod-003', name: 'Tropicana Orange Juice 1L', price: 120, quantity: 3, cost: 90 },
        { productId: 'prod-005', name: 'Amul Butter 500g', price: 275, quantity: 1, cost: 235 },
      ],
      subtotal: 635,
      discount: 25,
      total: 610,
      paymentMethod: 'Card',
      status: 'Completed',
      date: daysAgo(4, 5, 10),
      timeline: [{ status: 'Completed', time: daysAgo(4, 5, 0) }],
    },
    {
      id: 'ORD-9831',
      customerId: 'cust-103',
      customerName: 'Amit Verma',
      items: [
        { productId: 'prod-007', name: "Lay's Classic Salted 50g", price: 20, quantity: 5, cost: 14 },
        { productId: 'prod-002', name: 'Pepsi 750ml', price: 40, quantity: 3, cost: 27 },
      ],
      subtotal: 220,
      discount: 0,
      total: 220,
      paymentMethod: 'UPI',
      status: 'Completed',
      date: daysAgo(5, 7, 20),
      timeline: [{ status: 'Completed', time: daysAgo(5, 7, 10) }],
    },
    {
      id: 'ORD-9830',
      customerId: 'cust-110',
      customerName: 'Deepika Rao',
      items: [
        { productId: 'prod-013', name: 'Surf Excel Easy Wash Powder 1kg', price: 150, quantity: 1, cost: 120 },
        { productId: 'prod-011', name: 'Tata Salt Vacuum Evaporated 1kg', price: 28, quantity: 2, cost: 20 },
      ],
      subtotal: 206,
      discount: 0,
      total: 206,
      paymentMethod: 'Cash',
      status: 'Cancelled',
      date: daysAgo(6, 1, 30),
      timeline: [
        { status: 'Order Placed', time: daysAgo(6, 1, 30) },
        { status: 'Cancelled by Customer', time: daysAgo(6, 2, 0) },
      ],
    },
    {
      id: 'ORD-9829',
      customerId: 'cust-102',
      customerName: 'Priya Patel',
      items: [
        { productId: 'prod-012', name: 'Aashirvaad Sharbati Atta 5kg', price: 295, quantity: 2, cost: 245 },
        { productId: 'prod-005', name: 'Amul Butter 500g', price: 275, quantity: 1, cost: 235 },
      ],
      subtotal: 865,
      discount: 45,
      total: 820,
      paymentMethod: 'UPI',
      status: 'Completed',
      date: daysAgo(7, 4, 15),
      timeline: [{ status: 'Completed', time: daysAgo(7, 4, 10) }],
    },
    {
      id: 'ORD-9828',
      customerId: 'cust-101',
      customerName: 'Rahul Sharma',
      items: [
        { productId: 'prod-001', name: 'Coca-Cola 750ml', price: 40, quantity: 5, cost: 28 },
      ],
      subtotal: 200,
      discount: 0,
      total: 200,
      paymentMethod: 'UPI',
      status: 'Completed',
      date: daysAgo(8, 6, 0),
      timeline: [{ status: 'Completed', time: daysAgo(8, 6, 0) }],
    },
  ];

  // Inventory movements
  const inventoryMovements = [
    {
      id: 'mov-101',
      productId: 'prod-001',
      productName: 'Coca-Cola 750ml',
      type: 'SALE',
      quantityChange: -2,
      remainingStock: 8,
      reason: 'Order #ORD-9842',
      timestamp: daysAgo(0, 1, 20),
    },
    {
      id: 'mov-102',
      productId: 'prod-004',
      productName: 'Britannia Whole Wheat Bread',
      type: 'SALE',
      quantityChange: -2,
      remainingStock: 4,
      reason: 'Order #ORD-9841',
      timestamp: daysAgo(0, 3, 10),
    },
    {
      id: 'mov-103',
      productId: 'prod-006',
      productName: 'Amul Taaza Milk 1L',
      type: 'SALE',
      quantityChange: -2,
      remainingStock: 3,
      reason: 'Order #ORD-9841',
      timestamp: daysAgo(0, 3, 10),
    },
    {
      id: 'mov-104',
      productId: 'prod-001',
      productName: 'Coca-Cola 750ml',
      type: 'RESTOCK',
      quantityChange: +24,
      remainingStock: 16,
      reason: 'Supplier Invoice #HCCB-4412',
      timestamp: daysAgo(5, 2),
    },
    {
      id: 'mov-105',
      productId: 'prod-008',
      productName: 'Kurkure Masala Munch 90g',
      type: 'RESTOCK',
      quantityChange: +30,
      remainingStock: 38,
      reason: 'Weekly stock intake',
      timestamp: daysAgo(6, 4),
    },
  ];

  // Restock Tasks
  const restockTasks = [
    {
      id: 'task-001',
      productId: 'prod-001',
      productName: 'Coca-Cola 750ml',
      currentStock: 8,
      suggestedQuantity: 30,
      supplier: 'Hindustan Coca-Cola Beverages',
      estimatedCost: 840,
      status: 'pending', // pending, approved, ordered, received
      priority: 'HIGH',
      reason: 'High velocity (6.2/day) with only 8 units left (1.3 days of inventory)',
      createdAt: daysAgo(0, 4),
    },
    {
      id: 'task-002',
      productId: 'prod-004',
      productName: 'Britannia Whole Wheat Bread',
      currentStock: 4,
      suggestedQuantity: 20,
      supplier: 'Britannia Industries',
      estimatedCost: 700,
      status: 'pending',
      priority: 'CRITICAL',
      reason: 'Stock below 1-day threshold (4 units vs 5.4 daily velocity)',
      createdAt: daysAgo(0, 3),
    },
    {
      id: 'task-003',
      productId: 'prod-006',
      productName: 'Amul Taaza Milk 1L',
      currentStock: 3,
      suggestedQuantity: 25,
      supplier: 'Amul Dairy Local Depot',
      estimatedCost: 1200,
      status: 'approved',
      priority: 'CRITICAL',
      reason: 'Daily essential expiring fast, restock approved by manager',
      createdAt: daysAgo(1, 2),
    },
  ];

  // Promotions
  const promotions = [
    {
      id: 'promo-001',
      title: 'Morning Breakfast Combo',
      description: 'Buy Britannia Bread + Amul Butter & get 10% instant discount',
      discountPercent: 10,
      bundledProducts: ['prod-004', 'prod-005'],
      startDate: daysAgo(7),
      endDate: daysAgo(-7), // 7 days future
      isActive: true,
      usesCount: 18,
      aiGenerated: true,
    },
    {
      id: 'promo-002',
      title: 'Weekend Chill & Crunch',
      description: 'Coca-Cola 750ml + Kurkure Munch bundle combo',
      discountPercent: 8,
      bundledProducts: ['prod-001', 'prod-008'],
      startDate: daysAgo(3),
      endDate: daysAgo(-4),
      isActive: true,
      usesCount: 12,
      aiGenerated: true,
    },
  ];

  // Notifications
  const notifications = [
    {
      id: 'notif-001',
      title: 'Critical Low Stock Alert',
      message: 'Britannia Whole Wheat Bread has only 4 units remaining. High stockout risk today!',
      type: 'warning',
      timestamp: daysAgo(0, 1),
      read: false,
      link: '/inventory',
    },
    {
      id: 'notif-002',
      title: 'AI Weekly Business Digest Ready',
      message: 'Your store revenue is up 12.4% this week. Top performing category: Beverages.',
      type: 'success',
      timestamp: daysAgo(0, 5),
      read: false,
      link: '/reports',
    },
    {
      id: 'notif-003',
      title: 'New Online Order Received',
      message: 'Order #ORD-9842 by Rahul Sharma for ₹198 via UPI is marked completed.',
      type: 'info',
      timestamp: daysAgo(0, 1, 20),
      read: true,
      link: '/orders',
    },
    {
      id: 'notif-004',
      title: 'Customer Retention Notice',
      message: '3 regular customers have not ordered in over 30 days. Consider sending a promo.',
      type: 'info',
      timestamp: daysAgo(1, 2),
      read: true,
      link: '/customers',
    },
  ];

  const branches = [
    {
      id: 'branch-indiranagar',
      name: 'Indiranagar Flagship',
      code: 'BLR-IND-01',
      address: 'Shop 14, Sunrise Plaza, 100ft Road, Indiranagar',
      city: 'Bengaluru',
      phone: '+91 98765 43210',
      isPrimary: true,
    },
    {
      id: 'branch-koramangala',
      name: 'Koramangala 4th Block',
      code: 'BLR-KOR-02',
      address: 'Plot 28, 80ft Road, Near Sony World, Koramangala',
      city: 'Bengaluru',
      phone: '+91 98765 43211',
      isPrimary: false,
    },
    {
      id: 'branch-whitefield',
      name: 'Whitefield Express Outlet',
      code: 'BLR-WTF-03',
      address: 'Shop GF-04, Nexus Shantiniketan, Whitefield',
      city: 'Bengaluru',
      phone: '+91 98765 43212',
      isPrimary: false,
    },
  ];

  const cashDrawer = {
    shiftId: 'shift-today',
    isOpen: true,
    openedAt: daysAgo(0, 4, 30),
    openedBy: 'Nihar Puthran',
    openingFloat: 2000,
    paidIns: 0,
    paidOuts: 150, // e.g. local delivery boy petty cash
    movements: [
      { id: 'cdm-01', type: 'OPENING_FLOAT', amount: 2000, note: 'Daily opening cash drawer float', time: daysAgo(0, 4, 30) },
      { id: 'cdm-02', type: 'PAID_OUT', amount: 150, note: 'Packaging bags delivery boy tip/petty cash', time: daysAgo(0, 2, 10) },
    ],
  };

  const storeProfile = {
    storeId: DEMO_STORE_ID,
    storeName: 'DailyBasket Supermart',
    ownerName: 'Nihar Puthran',
    email: 'nihar@dailybasket.store',
    phone: '+91 98765 43210',
    address: 'Shop 14, Sunrise Plaza, Indiranagar, Bengaluru, KA 560038',
    businessType: 'Supermarket / Grocery & FMCG',
    currency: 'INR',
    taxRate: 5,
    cashierPin: '1234',
    loyaltyRate: 20, // 1 point per 20 currency spent
    loyaltyRedeemValue: 1, // 1 point = 1 currency
    createdAt: daysAgo(90),
    isDemo: true,
  };

  return {
    profile: storeProfile,
    branches,
    cashDrawer,
    products,
    customers,
    orders,
    inventoryMovements,
    restockTasks,
    promotions,
    notifications,
  };
};

// Global in-memory & event broadcaster
const listeners = new Map();

export const subscribeToStore = (storeId, callback) => {
  if (!listeners.has(storeId)) {
    listeners.set(storeId, new Set());
  }
  const set = listeners.get(storeId);
  set.add(callback);
  return () => set.delete(callback);
};

const notifyStoreListeners = (storeId) => {
  if (listeners.has(storeId)) {
    const data = getStoreData(storeId);
    listeners.get(storeId).forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.error('Error in store listener:', err);
      }
    });
  }
};

// Data persistence helpers
export const getStoreData = (storeId = DEMO_STORE_ID) => {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${storeId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.profile?.ownerName === 'Nishant Puthran' || parsed?.profile?.email?.includes('nishant')) {
        parsed.profile.ownerName = 'Nihar Puthran';
        parsed.profile.email = 'nihar@dailybasket.store';
        localStorage.setItem(`${STORAGE_PREFIX}${storeId}`, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse store data from storage', e);
  }

  // If no store exists or demo store, initialize demo data
  if (storeId === DEMO_STORE_ID) {
    const demoData = getInitialDemoData();
    saveStoreData(DEMO_STORE_ID, demoData);
    return demoData;
  }

  // Create an empty store template for new accounts
  const newStore = {
    profile: {
      storeId,
      storeName: 'My Retail Store',
      ownerName: 'Store Owner',
      email: '',
      currency: 'INR',
      businessType: 'Retail Store',
      createdAt: new Date().toISOString(),
      isDemo: false,
    },
    products: [],
    customers: [],
    orders: [],
    inventoryMovements: [],
    restockTasks: [],
    promotions: [],
    notifications: [
      {
        id: 'notif-welcome',
        title: 'Welcome to MiniMart AI! 🎉',
        message: 'Your store database is ready. Add products or import demo data to start.',
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false,
        link: '/products',
      },
    ],
  };
  saveStoreData(storeId, newStore);
  return newStore;
};

export const saveStoreData = (storeId, data) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${storeId}`, JSON.stringify(data));
    notifyStoreListeners(storeId);
  } catch (e) {
    console.error('Failed to save store data to localStorage:', e);
  }
};

export const resetStoreToDemo = (storeId = DEMO_STORE_ID) => {
  const freshDemo = getInitialDemoData();
  saveStoreData(storeId, freshDemo);
  return freshDemo;
};

// CRUD Operations

// --- PRODUCTS ---
export const addProduct = (storeId, productData) => {
  const data = getStoreData(storeId);
  const newProduct = {
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isActive: true,
    salesVelocity: 1.0,
    ...productData,
    sellingPrice: Number(productData.sellingPrice) || 0,
    costPrice: Number(productData.costPrice) || 0,
    stock: Number(productData.stock) || 0,
    reorderLevel: Number(productData.reorderLevel) || 10,
  };
  data.products.unshift(newProduct);

  // Log inventory movement for initial stock
  if (newProduct.stock > 0) {
    data.inventoryMovements.unshift({
      id: `mov-${Date.now()}`,
      productId: newProduct.id,
      productName: newProduct.name,
      type: 'INITIAL_STOCK',
      quantityChange: newProduct.stock,
      remainingStock: newProduct.stock,
      reason: 'Product creation',
      timestamp: new Date().toISOString(),
    });
  }

  saveStoreData(storeId, data);
  return newProduct;
};

export const updateProduct = (storeId, productId, updates) => {
  const data = getStoreData(storeId);
  const index = data.products.findIndex((p) => p.id === productId);
  if (index === -1) return null;

  const oldProduct = data.products[index];
  const updated = {
    ...oldProduct,
    ...updates,
    sellingPrice: Number(updates.sellingPrice !== undefined ? updates.sellingPrice : oldProduct.sellingPrice),
    costPrice: Number(updates.costPrice !== undefined ? updates.costPrice : oldProduct.costPrice),
    stock: Number(updates.stock !== undefined ? updates.stock : oldProduct.stock),
    reorderLevel: Number(updates.reorderLevel !== undefined ? updates.reorderLevel : oldProduct.reorderLevel),
  };

  data.products[index] = updated;
  saveStoreData(storeId, data);
  return updated;
};

export const deleteProduct = (storeId, productId) => {
  const data = getStoreData(storeId);
  data.products = data.products.filter((p) => p.id !== productId);
  saveStoreData(storeId, data);
  return true;
};

// --- INVENTORY & RESTOCK ---
export const restockProduct = (storeId, { productId, quantity, supplier, cost, notes, expectedDate }) => {
  const data = getStoreData(storeId);
  const product = data.products.find((p) => p.id === productId);
  if (!product) return null;

  const qty = Number(quantity) || 0;
  const newStock = product.stock + qty;
  product.stock = newStock;
  if (supplier) product.supplier = supplier;

  data.inventoryMovements.unshift({
    id: `mov-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    type: 'RESTOCK',
    quantityChange: qty,
    remainingStock: newStock,
    reason: notes || `Restocked via inventory management (${supplier || 'Supplier'})`,
    cost: Number(cost) || (qty * product.costPrice),
    expectedDate: expectedDate || null,
    timestamp: new Date().toISOString(),
  });

  // If there is an active restock task for this product, update it
  const task = data.restockTasks.find((t) => t.productId === productId && t.status !== 'received');
  if (task) {
    task.status = 'received';
  }

  saveStoreData(storeId, data);
  return product;
};

// --- ORDERS ---
export const createOrder = (storeId, orderData) => {
  const data = getStoreData(storeId);
  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Calculate total, reduce stock, update customer stats
  let subtotal = 0;
  const items = orderData.items.map((item) => {
    const prod = data.products.find((p) => p.id === item.productId);
    const price = Number(item.price || (prod ? prod.sellingPrice : 0));
    const qty = Number(item.quantity) || 1;
    const itemSub = price * qty;
    subtotal += itemSub;

    // Reduce product stock
    if (prod) {
      prod.stock = Math.max(0, prod.stock - qty);
      // Log movement
      data.inventoryMovements.unshift({
        id: `mov-${Date.now()}-${item.productId}`,
        productId: prod.id,
        productName: prod.name,
        type: 'SALE',
        quantityChange: -qty,
        remainingStock: prod.stock,
        reason: `Order #${orderId}`,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      productId: item.productId,
      name: item.name || (prod ? prod.name : 'Item'),
      price,
      quantity: qty,
      cost: prod ? prod.costPrice : price * 0.7,
    };
  });

  const discount = Number(orderData.discount) || 0;
  const total = Math.max(0, subtotal - discount);

  const newOrder = {
    id: orderId,
    customerId: orderData.customerId || 'cust-walkin',
    customerName: orderData.customerName || 'Walk-in Customer',
    items,
    subtotal,
    discount,
    total,
    paymentMethod: orderData.paymentMethod || 'Cash',
    status: orderData.status || 'Completed',
    date: new Date().toISOString(),
    timeline: [
      { status: 'Order Placed', time: new Date().toISOString() },
      { status: orderData.status || 'Completed', time: new Date().toISOString() },
    ],
  };

  data.orders.unshift(newOrder);

  // Update customer if known (Loyalty points earn and redeem)
  if (orderData.customerId && orderData.customerId !== 'cust-walkin') {
    const cust = data.customers.find((c) => c.id === orderData.customerId);
    if (cust) {
      cust.totalOrders = (cust.totalOrders || 0) + 1;
      cust.totalSpent = (cust.totalSpent || 0) + total;
      cust.lastPurchaseDate = new Date().toISOString();
      cust.status = 'Active';

      // Deduct redeemed points
      const redeemed = Number(orderData.redeemedPoints || 0);
      const currentPts = Number(cust.loyaltyPoints || 0);
      const afterRedemption = Math.max(0, currentPts - redeemed);

      // Earn 1 point per 20 spent
      const pointsEarned = Math.floor(total / (data.profile?.loyaltyRate || 20));
      cust.loyaltyPoints = afterRedemption + pointsEarned;

      // Update tier based on total spent
      if (cust.totalSpent >= 10000) cust.loyaltyTier = 'Platinum';
      else if (cust.totalSpent >= 5000) cust.loyaltyTier = 'Gold';
      else if (cust.totalSpent >= 2500) cust.loyaltyTier = 'Silver';
      else cust.loyaltyTier = 'Bronze';
    }
  }

  // If cash payment, log into active cash drawer
  if (orderData.paymentMethod === 'Cash' && data.cashDrawer?.isOpen) {
    data.cashDrawer.movements = data.cashDrawer.movements || [];
    data.cashDrawer.movements.unshift({
      id: `cdm-${Date.now()}`,
      type: 'CASH_SALE',
      amount: total,
      note: `Cash sale from Order #${orderId}`,
      time: new Date().toISOString(),
    });
  }

  // Create notification for new order
  data.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Order Created',
    message: `Order #${orderId} (${formatCurrencyHelper(total, data.profile?.currency)}) created successfully.`,
    type: 'success',
    timestamp: new Date().toISOString(),
    read: false,
    link: '/orders',
  });

  saveStoreData(storeId, data);
  return newOrder;
};

const formatCurrencyHelper = (amt, curr = 'INR') => {
  return `${curr === 'INR' ? '₹' : '$'}${Number(amt).toLocaleString()}`;
};

export const updateOrderStatus = (storeId, orderId, newStatus) => {
  const data = getStoreData(storeId);
  const order = data.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.status = newStatus;
  if (!order.timeline) order.timeline = [];
  order.timeline.push({
    status: `Status updated to ${newStatus}`,
    time: new Date().toISOString(),
  });

  saveStoreData(storeId, data);
  return order;
};

// --- CUSTOMERS ---
export const addCustomer = (storeId, customerData) => {
  const data = getStoreData(storeId);
  const newCustomer = {
    id: `cust-${Date.now()}`,
    createdAt: new Date().toISOString(),
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 50, // Welcome bonus points!
    loyaltyTier: 'Bronze',
    lastPurchaseDate: null,
    status: 'New',
    preferredCategories: [],
    ...customerData,
  };
  data.customers.unshift(newCustomer);
  saveStoreData(storeId, data);
  return newCustomer;
};

export const updateCustomer = (storeId, customerId, updates) => {
  const data = getStoreData(storeId);
  const index = data.customers.findIndex((c) => c.id === customerId);
  if (index === -1) return null;

  data.customers[index] = { ...data.customers[index], ...updates };
  saveStoreData(storeId, data);
  return data.customers[index];
};

// --- RESTOCK TASKS ---
export const createRestockTask = (storeId, taskData) => {
  const data = getStoreData(storeId);
  const newTask = {
    id: `task-${Date.now()}`,
    status: 'pending',
    priority: taskData.priority || 'HIGH',
    createdAt: new Date().toISOString(),
    ...taskData,
  };
  data.restockTasks.unshift(newTask);

  data.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Restock Action Created',
    message: `Restock task for ${newTask.productName} (${newTask.suggestedQuantity} units) created.`,
    type: 'info',
    timestamp: new Date().toISOString(),
    read: false,
    link: '/inventory',
  });

  saveStoreData(storeId, data);
  return newTask;
};

export const updateRestockTaskStatus = (storeId, taskId, status) => {
  const data = getStoreData(storeId);
  const task = data.restockTasks.find((t) => t.id === taskId);
  if (!task) return null;

  task.status = status;
  if (status === 'received') {
    // Automatically restock product
    const product = data.products.find((p) => p.id === task.productId);
    if (product) {
      product.stock += Number(task.suggestedQuantity) || 0;
      data.inventoryMovements.unshift({
        id: `mov-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        type: 'RESTOCK',
        quantityChange: Number(task.suggestedQuantity) || 0,
        remainingStock: product.stock,
        reason: `Task #${taskId} fulfilled`,
        timestamp: new Date().toISOString(),
      });
    }
  }

  saveStoreData(storeId, data);
  return task;
};

// --- PROMOTIONS ---
export const createPromotion = (storeId, promoData) => {
  const data = getStoreData(storeId);
  const newPromo = {
    id: `promo-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isActive: true,
    usesCount: 0,
    ...promoData,
  };
  data.promotions.unshift(newPromo);

  data.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Promotion Active 🎉',
    message: `Promotion "${newPromo.title}" (${newPromo.discountPercent}% OFF) is live!`,
    type: 'success',
    timestamp: new Date().toISOString(),
    read: false,
    link: '/dashboard',
  });

  saveStoreData(storeId, data);
  return newPromo;
};

// --- NOTIFICATIONS ---
export const markNotificationRead = (storeId, notifId) => {
  const data = getStoreData(storeId);
  if (notifId === 'ALL') {
    data.notifications.forEach((n) => (n.read = true));
  } else {
    const notif = data.notifications.find((n) => n.id === notifId);
    if (notif) notif.read = true;
  }
  saveStoreData(storeId, data);
};

// --- CASH DRAWER & DAY-END SHIFT ---
export const recordCashMovement = (storeId, { type, amount, note }) => {
  const data = getStoreData(storeId);
  if (!data.cashDrawer) {
    data.cashDrawer = { isOpen: true, openingFloat: 2000, paidIns: 0, paidOuts: 0, movements: [] };
  }
  const amt = Number(amount) || 0;
  if (type === 'PAID_OUT') {
    data.cashDrawer.paidOuts = (data.cashDrawer.paidOuts || 0) + amt;
  } else if (type === 'PAID_IN') {
    data.cashDrawer.paidIns = (data.cashDrawer.paidIns || 0) + amt;
  }
  data.cashDrawer.movements = data.cashDrawer.movements || [];
  data.cashDrawer.movements.unshift({
    id: `cdm-${Date.now()}`,
    type,
    amount: amt,
    note: note || (type === 'PAID_OUT' ? 'Petty cash expense' : 'Cash deposit to drawer'),
    time: new Date().toISOString(),
  });
  saveStoreData(storeId, data);
  return data.cashDrawer;
};

export const closeDayShift = (storeId, { countedCash, notes, closedBy }) => {
  const data = getStoreData(storeId);
  if (!data.cashDrawer) return null;

  const summary = {
    closedAt: new Date().toISOString(),
    closedBy: closedBy || data.profile?.ownerName || 'Cashier',
    openingFloat: data.cashDrawer.openingFloat || 2000,
    paidIns: data.cashDrawer.paidIns || 0,
    paidOuts: data.cashDrawer.paidOuts || 0,
    countedCash: Number(countedCash) || 0,
    notes: notes || 'Day-end cash drawer close',
    movements: [...(data.cashDrawer.movements || [])],
  };

  data.cashDrawer.lastClosedShift = summary;
  data.cashDrawer.isOpen = false;

  saveStoreData(storeId, data);
  return summary;
};

export const openDayShift = (storeId, { openingFloat, openedBy }) => {
  const data = getStoreData(storeId);
  data.cashDrawer = {
    shiftId: `shift-${Date.now()}`,
    isOpen: true,
    openedAt: new Date().toISOString(),
    openedBy: openedBy || data.profile?.ownerName || 'Store Manager',
    openingFloat: Number(openingFloat) || 2000,
    paidIns: 0,
    paidOuts: 0,
    movements: [
      { id: `cdm-${Date.now()}`, type: 'OPENING_FLOAT', amount: Number(openingFloat) || 2000, note: 'Opening cash float', time: new Date().toISOString() },
    ],
  };
  saveStoreData(storeId, data);
  return data.cashDrawer;
};

// --- STORE PROFILE & BRANCHES ---
export const updateStoreProfile = (storeId, profileUpdates) => {
  const data = getStoreData(storeId);
  data.profile = { ...data.profile, ...profileUpdates };
  saveStoreData(storeId, data);
  return data.profile;
};

export const addBranch = (storeId, branchData) => {
  const data = getStoreData(storeId);
  data.branches = data.branches || [];
  const newBranch = {
    id: `branch-${Date.now()}`,
    ...branchData,
  };
  data.branches.push(newBranch);
  saveStoreData(storeId, data);
  return newBranch;
};
