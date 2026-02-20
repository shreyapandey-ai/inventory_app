import { PrismaClient, Role, MovementType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Inventory Data...");

  // ================= USERS =================
  const adminPassword = await bcrypt.hash("admin123", 10);
  const managerPassword = await bcrypt.hash("manager123", 10);

  await prisma.user.upsert({
    where: { email: "admin@inventory.com" },
    update: {},
    create: {
      email: "admin@inventory.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "manager@inventory.com" },
    update: {},
    create: {
      email: "manager@inventory.com",
      password: managerPassword,
      role: Role.MANAGER,
    },
  });

  // ================= CATEGORIES =================
  const categoryNames = [
    "Electronics",
    "Groceries",
    "Furniture",
    "Clothing",
    "Stationery",
  ];

  const categories = [];

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(category);
  }

  // ================= SUPPLIERS =================
  const supplierData = [
    { name: "TechWorld Pvt Ltd", email: "tech@world.com", phone: "9876543210" },
    { name: "FreshFarm Distributors", email: "sales@freshfarm.com", phone: "9123456789" },
    { name: "UrbanFurniture Co", email: "contact@urbanfurn.com", phone: "9988776655" },
    { name: "StyleHub Fashion", email: "support@stylehub.com", phone: "8899001122" },
    { name: "PaperPlus Supplies", email: "info@paperplus.com", phone: "9012345678" },
  ];

  const suppliers = [];

  for (const sup of supplierData) {
    const supplier = await prisma.supplier.upsert({
      where: { name: sup.name },
      update: {},
      create: sup,
    });
    suppliers.push(supplier);
  }

  // ================= PRODUCTS =================
  const productsData = [
    { name: "Laptop", sku: "ELEC-001", price: 75000, qty: 40, cat: 0, sup: 0 },
    { name: "Smartphone", sku: "ELEC-002", price: 35000, qty: 60, cat: 0, sup: 0 },
    { name: "Bluetooth Speaker", sku: "ELEC-003", price: 4500, qty: 80, cat: 0, sup: 0 },
    { name: "LED Monitor", sku: "ELEC-004", price: 15000, qty: 30, cat: 0, sup: 0 },

    { name: "Basmati Rice 5kg", sku: "GROC-001", price: 600, qty: 120, cat: 1, sup: 1 },
    { name: "Cooking Oil 1L", sku: "GROC-002", price: 150, qty: 200, cat: 1, sup: 1 },
    { name: "Sugar 1kg", sku: "GROC-003", price: 50, qty: 300, cat: 1, sup: 1 },
    { name: "Tea Powder 500g", sku: "GROC-004", price: 220, qty: 150, cat: 1, sup: 1 },

    { name: "Office Chair", sku: "FURN-001", price: 5500, qty: 25, cat: 2, sup: 2 },
    { name: "Wooden Desk", sku: "FURN-002", price: 12000, qty: 15, cat: 2, sup: 2 },
    { name: "Bookshelf", sku: "FURN-003", price: 8000, qty: 10, cat: 2, sup: 2 },
    { name: "Sofa Set", sku: "FURN-004", price: 45000, qty: 5, cat: 2, sup: 2 },

    { name: "Men T-Shirt", sku: "CLOT-001", price: 799, qty: 100, cat: 3, sup: 3 },
    { name: "Women Jeans", sku: "CLOT-002", price: 1499, qty: 75, cat: 3, sup: 3 },
    { name: "Jacket", sku: "CLOT-003", price: 2499, qty: 50, cat: 3, sup: 3 },
    { name: "Sneakers", sku: "CLOT-004", price: 2999, qty: 60, cat: 3, sup: 3 },

    { name: "Notebook Pack", sku: "STAT-001", price: 120, qty: 200, cat: 4, sup: 4 },
    { name: "Ball Pens (Pack of 10)", sku: "STAT-002", price: 80, qty: 300, cat: 4, sup: 4 },
    { name: "Printer Paper A4", sku: "STAT-003", price: 350, qty: 150, cat: 4, sup: 4 },
    { name: "Stapler", sku: "STAT-004", price: 180, qty: 100, cat: 4, sup: 4 },
  ];

  for (const p of productsData) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        name: p.name,
        sku: p.sku,
        price: p.price,
        quantity: p.qty,
        categoryId: categories[p.cat].id,
        supplierId: suppliers[p.sup].id,
      },
    });

    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        type: MovementType.RESTOCK,
        quantity: p.qty,
        note: "Initial stock added",
      },
    });
  }

  console.log("✅ 20 Products Seeded Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });