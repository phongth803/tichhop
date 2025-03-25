import { FiSmartphone, FiMonitor, FiWatch, FiCamera, FiHeadphones, FiCommand, FiHome, FiTv } from 'react-icons/fi'

// Sidebar categories
export const sidebarCategories = [
  { name: "Woman's Fashion", hasSubmenu: true },
  { name: "Men's Fashion", hasSubmenu: true },
  { name: 'Electronics' },
  { name: 'Home & Lifestyle' },
  { name: 'Medicine' },
  { name: 'Sports & Outdoor' },
  { name: "Baby's & Toys" },
  { name: 'Groceries & Pets' },
  { name: 'Health & Beauty' }
]

// Browse categories
export const categories = [
  { icon: FiSmartphone, name: 'Phones' },
  { icon: FiMonitor, name: 'Computers' },
  { icon: FiWatch, name: 'SmartWatch' },
  { icon: FiCamera, name: 'Camera' },
  { icon: FiHeadphones, name: 'HeadPhones' },
  { icon: FiCommand, name: 'Gaming' },
  { icon: FiHome, name: 'Home Appliances' },
  { icon: FiTv, name: 'TV' }
]

export const heroSlides = [
  {
    id: 1,
    title: 'iPhone 14 Series',
    subtitle: 'Up to 10% off Voucher',
    image: 'src/assets/images/iphone-14.png',
    logo: 'src/assets/images/apple-logo.png'
  },
  {
    id: 2,
    title: 'iPhone 14 Series',
    subtitle: 'Up to 10% off Voucher',
    image: 'src/assets/images/iphone-14.png',
    logo: 'src/assets/images/apple-logo.png'
  },
  {
    id: 3,
    title: 'iPhone 14 Series',
    subtitle: 'Up to 10% off Voucher',
    image: 'src/assets/images/iphone-14.png',
    logo: 'src/assets/images/apple-logo.png'
  },
  {
    id: 4,
    title: 'iPhone 14 Series',
    subtitle: 'Up to 10% off Voucher',
    image: 'src/assets/images/iphone-14.png',
    logo: 'src/assets/images/apple-logo.png'
  },
  {
    id: 5,
    title: 'iPhone 14 Series',
    subtitle: 'Up to 10% off Voucher',
    image: 'src/assets/images/iphone-14.png',
    logo: 'src/assets/images/apple-logo.png'
  }
  // Thêm các slides khác nếu cần
]

export const flashSaleProducts = [
  {
    id: 1,
    name: 'HAVIT HV-G92 Gamepad',
    image: '/images/gamepad.png',
    price: 120,
    originalPrice: 160,
    rating: 5,
    reviews: 88,
    discount: 40
  },
  {
    id: 2,
    name: 'AK-900 Wired Keyboard',
    image: '/images/keyboard.png',
    price: 960,
    originalPrice: 1160,
    rating: 4,
    reviews: 75,
    discount: 35
  },
  {
    id: 3,
    name: 'IPS LCD Gaming Monitor',
    image: '/images/monitor.png',
    price: 370,
    originalPrice: 400,
    rating: 5,
    reviews: 99,
    discount: 30
  },
  {
    id: 4,
    name: 'S-Series Comfort Chair',
    image: '/images/chair.png',
    price: 375,
    originalPrice: 400,
    rating: 5,
    reviews: 99,
    discount: 25
  },
  {
    id: 5,
    name: 'Logitech G Pro Wireless',
    image: '/images/mouse-1.png',
    price: 89,
    originalPrice: 149,
    rating: 5,
    reviews: 145,
    discount: 40
  },
  {
    id: 6,
    name: 'Razer BlackShark V2 Pro',
    image: '/images/headset-1.png',
    price: 159,
    originalPrice: 199,
    rating: 4,
    reviews: 89,
    discount: 20
  },
  {
    id: 7,
    name: 'Samsung 27" Gaming Monitor',
    image: '/images/monitor-2.png',
    price: 299,
    originalPrice: 499,
    rating: 5,
    reviews: 122,
    discount: 40
  },
  {
    id: 8,
    name: 'ROG Strix Gaming Chair',
    image: '/images/chair-2.png',
    price: 399,
    originalPrice: 599,
    rating: 4,
    reviews: 67,
    discount: 35
  },
  {
    id: 9,
    name: 'MacBook Pro M2',
    image: '/images/laptop-1.png',
    price: 1299,
    originalPrice: 1499,
    rating: 5,
    reviews: 234,
    discount: 15,
    isNew: true
  },
  {
    id: 10,
    name: 'iPad Pro 12.9"',
    image: '/images/ipad-1.png',
    price: 899,
    originalPrice: 1099,
    rating: 5,
    reviews: 178,
    discount: 20
  },
  {
    id: 11,
    name: 'Sony WH-1000XM4',
    image: '/images/headphone-1.png',
    price: 249,
    originalPrice: 349,
    rating: 5,
    reviews: 445,
    discount: 30
  },
  {
    id: 12,
    name: 'DJI Mini 3 Pro',
    image: '/images/drone-1.png',
    price: 699,
    originalPrice: 899,
    rating: 4,
    reviews: 89,
    discount: 25,
    isNew: true
  },
  {
    id: 13,
    name: 'GoPro Hero 11 Black',
    image: '/images/camera-1.png',
    price: 399,
    originalPrice: 499,
    rating: 4,
    reviews: 156,
    discount: 20,
    isNew: true
  },
  {
    id: 14,
    name: 'Nintendo Switch OLED',
    image: '/images/console-1.png',
    price: 299,
    originalPrice: 349,
    rating: 5,
    reviews: 234,
    discount: 15
  },
  {
    id: 15,
    name: 'Dyson V15 Detect',
    image: '/images/vacuum-1.png',
    price: 599,
    originalPrice: 749,
    rating: 5,
    reviews: 167,
    discount: 20
  },
  {
    id: 16,
    name: 'iPhone 14 Pro Max',
    image: '/images/phone-1.png',
    price: 999,
    originalPrice: 1199,
    rating: 5,
    reviews: 445,
    discount: 15,
    isNew: true
  },
  {
    id: 17,
    name: 'Samsung 65" QLED TV',
    image: '/images/tv-1.png',
    price: 1299,
    originalPrice: 1799,
    rating: 4,
    reviews: 178,
    discount: 30
  },
  {
    id: 18,
    name: 'Bose QuietComfort 45',
    image: '/images/headphone-2.png',
    price: 279,
    originalPrice: 329,
    rating: 4,
    reviews: 234,
    discount: 15
  },
  {
    id: 19,
    name: 'Canon EOS R6',
    image: '/images/camera-2.png',
    price: 1999,
    originalPrice: 2499,
    rating: 5,
    reviews: 89,
    discount: 20,
    isNew: true
  },
  {
    id: 20,
    name: 'Xbox Series X',
    image: '/images/console-2.png',
    price: 449,
    originalPrice: 499,
    rating: 5,
    reviews: 267,
    discount: 10
  }
]

export const bestSellingProducts = [
  {
    id: 1,
    name: 'The north coat',
    image: '/images/north-coat.jpg',
    price: 260,
    originalPrice: 360,
    rating: 5,
    reviews: 65
  },
  {
    id: 2,
    name: 'Gucci duffle bag',
    image: '/images/gucci-bag.jpg',
    price: 960,
    originalPrice: 1160,
    rating: 4,
    reviews: 65
  },
  {
    id: 3,
    name: 'RGB liquid CPU Cooler',
    image: '/images/cpu-cooler.jpg',
    price: 160,
    originalPrice: 170,
    rating: 4,
    reviews: 65
  },
  {
    id: 4,
    name: 'Small BookSelf',
    image: '/images/bookshelf.jpg',
    price: 360,
    rating: 5,
    reviews: 65
  },
  {
    id: 5,
    name: 'Nike Air Jordan 1',
    image: '/images/shoes-1.jpg',
    price: 189,
    originalPrice: 219,
    rating: 5,
    reviews: 445
  },
  {
    id: 6,
    name: 'Ray-Ban Aviator',
    image: '/images/sunglasses-1.jpg',
    price: 159,
    originalPrice: 189,
    rating: 4,
    reviews: 178
  },
  {
    id: 7,
    name: 'Apple Watch Series 8',
    image: '/images/watch-1.jpg',
    price: 399,
    originalPrice: 429,
    rating: 5,
    reviews: 267
  },
  {
    id: 8,
    name: 'Breed Dry Dog Food',
    image: '/images/dog-food.jpg',
    price: 100,
    rating: 3,
    reviews: 35
  },
  {
    id: 9,
    name: 'CANON EOS DSLR Camera',
    image: '/images/camera.jpg',
    price: 360,
    rating: 4,
    reviews: 95
  },
  {
    id: 10,
    name: 'Quilted Satin Jacket',
    image: '/images/jacket.jpg',
    price: 660,
    rating: 5,
    reviews: 55
  },
  {
    id: 11,
    name: 'Premium Leather Bag',
    image: '/images/leather-bag.jpg',
    price: 450,
    originalPrice: 500,
    rating: 5,
    reviews: 72
  }
]

export const newArrivals = [
  {
    id: 1,
    title: 'PlayStation 5',
    description: 'Black and White version of the PS5 coming out on sale.',
    image: '/images/ps5.jpg',
    colSpan: 2,
    rowSpan: 2
  },
  {
    id: 2,
    title: "Women's Collections",
    description: 'Featured woman collections that give you another vibe.',
    image: '/images/women-collection.jpg',
    colSpan: 2
  },
  {
    id: 3,
    title: 'Speakers',
    description: 'Amazon wireless speakers',
    image: '/images/speakers.jpg'
  },
  {
    id: 4,
    title: 'Perfume',
    description: 'GUCCI INTENSE OUD EDP',
    image: '/images/perfume.jpg'
  }
]

export const services = [
  {
    icon: '/images/delivery-icon.png',
    title: 'FREE AND FAST DELIVERY',
    description: 'Free delivery for all orders over $140'
  },
  {
    icon: '/images/customer-service-icon.png',
    title: '24/7 CUSTOMER SERVICE',
    description: 'Friendly 24/7 customer support'
  },
  {
    icon: '/images/secure-icon.png',
    title: 'MONEY BACK GUARANTEE',
    description: 'We return money within 30 days'
  }
]

export const exploreProducts = [
  {
    id: 1,
    name: 'HAVIT HV-G92 Gamepad',
    image: '/images/gamepad.png',
    price: 120,
    originalPrice: 160,
    rating: 5,
    reviews: 88,
    isNew: true
  },
  {
    id: 2,
    name: 'AK-900 Wired Keyboard',
    image: '/images/keyboard.png',
    price: 960,
    originalPrice: 1160,
    rating: 4,
    reviews: 75,
    discount: 35
  },
  {
    id: 3,
    name: 'IPS LCD Gaming Monitor',
    image: '/images/monitor.png',
    price: 370,
    originalPrice: 400,
    rating: 5,
    reviews: 99,
    discount: 30
  },
  {
    id: 4,
    name: 'S-Series Comfort Chair',
    image: '/images/chair.png',
    price: 375,
    originalPrice: 400,
    rating: 5,
    reviews: 99,
    discount: 25
  },
  {
    id: 5,
    name: 'Logitech G Pro Wireless',
    image: '/images/mouse-1.png',
    price: 89,
    originalPrice: 149,
    rating: 5,
    reviews: 145,
    discount: 40
  },
  {
    id: 6,
    name: 'Razer BlackShark V2 Pro',
    image: '/images/headset-1.png',
    price: 159,
    originalPrice: 199,
    rating: 4,
    reviews: 89,
    discount: 20
  },
  {
    id: 7,
    name: 'Samsung 27" Gaming Monitor',
    image: '/images/monitor-2.png',
    price: 299,
    originalPrice: 499,
    rating: 5,
    reviews: 122,
    discount: 40
  },
  {
    id: 8,
    name: 'ROG Strix Gaming Chair',
    image: '/images/chair-2.png',
    price: 399,
    originalPrice: 599,
    rating: 4,
    reviews: 67,
    discount: 35
  },
  {
    id: 9,
    name: 'MacBook Pro M2',
    image: '/images/laptop-1.png',
    price: 1299,
    originalPrice: 1499,
    rating: 5,
    reviews: 234,
    discount: 15,
    isNew: true
  },
  {
    id: 10,
    name: 'iPad Pro 12.9"',
    image: '/images/ipad-1.png',
    price: 899,
    originalPrice: 1099,
    rating: 5,
    reviews: 178,
    discount: 20
  },
  {
    id: 11,
    name: 'Sony WH-1000XM4',
    image: '/images/headphone-1.png',
    price: 249,
    originalPrice: 349,
    rating: 5,
    reviews: 445,
    discount: 30
  },
  {
    id: 12,
    name: 'DJI Mini 3 Pro',
    image: '/images/drone-1.png',
    price: 699,
    originalPrice: 899,
    rating: 4,
    reviews: 89,
    discount: 25,
    isNew: true
  },
  {
    id: 13,
    name: 'GoPro Hero 11 Black',
    image: '/images/camera-1.png',
    price: 399,
    originalPrice: 499,
    rating: 4,
    reviews: 156,
    discount: 20,
    isNew: true
  },
  {
    id: 14,
    name: 'Nintendo Switch OLED',
    image: '/images/console-1.png',
    price: 299,
    originalPrice: 349,
    rating: 5,
    reviews: 234,
    discount: 15
  },
  {
    id: 15,
    name: 'Dyson V15 Detect',
    image: '/images/vacuum-1.png',
    price: 599,
    originalPrice: 749,
    rating: 5,
    reviews: 167,
    discount: 20
  },
  {
    id: 16,
    name: 'iPhone 14 Pro Max',
    image: '/images/phone-1.png',
    price: 999,
    originalPrice: 1199,
    rating: 5,
    reviews: 445,
    discount: 15,
    isNew: true
  },
  {
    id: 17,
    name: 'Samsung 65" QLED TV',
    image: '/images/tv-1.png',
    price: 1299,
    originalPrice: 1799,
    rating: 4,
    reviews: 178,
    discount: 30
  },
  {
    id: 18,
    name: 'Bose QuietComfort 45',
    image: '/images/headphone-2.png',
    price: 279,
    originalPrice: 329,
    rating: 4,
    reviews: 234,
    discount: 15
  },
  {
    id: 19,
    name: 'Canon EOS R6',
    image: '/images/camera-2.png',
    price: 1999,
    originalPrice: 2499,
    rating: 5,
    reviews: 89,
    discount: 20,
    isNew: true
  },
  {
    id: 20,
    name: 'Xbox Series X',
    image: '/images/console-2.png',
    price: 449,
    originalPrice: 499,
    rating: 5,
    reviews: 267,
    discount: 10
  }
]

// Thêm các danh mục sản phẩm mới
export const newCategories = [
  'Smartphones',
  'Laptops',
  'Audio Devices',
  'Smart Home',
  'Wearables',
  'Photography',
  'Gaming',
  'Home Appliances',
  'TV & Entertainment',
  'Office Equipment'
]
