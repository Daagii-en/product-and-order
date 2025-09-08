export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
};

export const PRODUCTS: Product[] = [
  { id: "1b7f5d7e-3b1d-4f39-9b1d-111111111111", name: "T-Shirt Classic", sku: "SKU-TS-001", price: 20000, stock: 50, created_at: "2025-08-01T04:00:00Z", updated_at: "2025-08-01T04:00:00Z" },
  { id: "2b7f5d7e-3b1d-4f39-9b1d-222222222222", name: "T-Shirt Premium", sku: "SKU-TS-002", price: 28000, stock: 35, created_at: "2025-08-02T04:00:00Z", updated_at: "2025-08-02T04:00:00Z" },
  { id: "3b7f5d7e-3b1d-4f39-9b1d-333333333333", name: "Hoodie", sku: "SKU-HD-001", price: 65000, stock: 20, created_at: "2025-08-03T04:00:00Z", updated_at: "2025-08-03T04:00:00Z" },
  { id: "4b7f5d7e-3b1d-4f39-9b1d-444444444444", name: "Cap", sku: "SKU-CP-001", price: 18000, stock: 40, created_at: "2025-08-04T04:00:00Z", updated_at: "2025-08-04T04:00:00Z" },
  { id: "5b7f5d7e-3b1d-4f39-9b1d-555555555555", name: "Mug", sku: "SKU-MG-001", price: 15000, stock: 80, created_at: "2025-08-05T04:00:00Z", updated_at: "2025-08-05T04:00:00Z" },
  { id: "6b7f5d7e-3b1d-4f39-9b1d-666666666666", name: "Water Bottle", sku: "SKU-WB-001", price: 22000, stock: 60, created_at: "2025-08-06T04:00:00Z", updated_at: "2025-08-06T04:00:00Z" },
  { id: "7b7f5d7e-3b1d-4f39-9b1d-777777777777", name: "Notebook A5", sku: "SKU-NB-001", price: 12000, stock: 120, created_at: "2025-08-07T04:00:00Z", updated_at: "2025-08-07T04:00:00Z" },
  { id: "8b7f5d7e-3b1d-4f39-9b1d-888888888888", name: "Sticker Pack", sku: "SKU-ST-001", price: 5000, stock: 200, created_at: "2025-08-08T04:00:00Z", updated_at: "2025-08-08T04:00:00Z" },
  { id: "9b7f5d7e-3b1d-4f39-9b1d-999999999999", name: "Keychain", sku: "SKU-KC-001", price: 7000, stock: 150, created_at: "2025-08-09T04:00:00Z", updated_at: "2025-08-09T04:00:00Z" },
  { id: "aa7f5d7e-3b1d-4f39-9b1d-aaaaaaaaaaaa", name: "Socks", sku: "SKU-SK-001", price: 14000, stock: 75, created_at: "2025-08-10T04:00:00Z", updated_at: "2025-08-10T04:00:00Z" },
  { id: "bb7f5d7e-3b1d-4f39-9b1d-bbbbbbbbbbbb", name: "Beanie", sku: "SKU-BN-001", price: 23000, stock: 32, created_at: "2025-08-11T04:00:00Z", updated_at: "2025-08-11T04:00:00Z" },
  { id: "cc7f5d7e-3b1d-4f39-9b1d-cccccccccccc", name: "Backpack", sku: "SKU-BP-001", price: 95000, stock: 15, created_at: "2025-08-12T04:00:00Z", updated_at: "2025-08-12T04:00:00Z" },
  { id: "dd7f5d7e-3b1d-4f39-9b1d-dddddddddddd", name: "Phone Case", sku: "SKU-PC-001", price: 25000, stock: 45, created_at: "2025-08-13T04:00:00Z", updated_at: "2025-08-13T04:00:00Z" },
  { id: "ee7f5d7e-3b1d-4f39-9b1d-eeeeeeeeeeee", name: "Mouse Pad", sku: "SKU-MP-001", price: 16000, stock: 70, created_at: "2025-08-14T04:00:00Z", updated_at: "2025-08-14T04:00:00Z" },
  { id: "ff7f5d7e-3b1d-4f39-9b1d-ffffffffffff", name: "Desk Mat", sku: "SKU-DM-001", price: 38000, stock: 28, created_at: "2025-08-15T04:00:00Z", updated_at: "2025-08-15T04:00:00Z" }
];