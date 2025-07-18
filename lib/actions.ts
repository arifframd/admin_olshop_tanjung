"use server";

import { NewCheckoutProps } from ".";
import { Product } from "./models/products";
import { Transaction } from "./models/transactions";
import { connectDB } from "./mongodb";

export const createProduct = async (form: FormData, imageUrl: any, public_id: any) => {
  // ambil data dari form
  const { name, price, description, category, stock } = Object.fromEntries(form.entries());

  try {
    await connectDB(); // connect ke database

    // tambahakan data ke database
    const result = await Product.create({
      name,
      price,
      description,
      category,
      imageUrl: imageUrl,
      public_id: public_id,
      stock,
    });
    console.log("result: ", result);
  } catch (error) {
    console.log("error: ", error);
  }
};

export const updateProduct = async (form: FormData, productId: string, imageUrl: any, public_id: any) => {
  // ambil data dari form
  const { name, price, description, category, stock } = Object.fromEntries(form.entries());

  try {
    await connectDB();
    const currentProduct = await Product.findById(productId);
    // update produk
    currentProduct.name = name;
    currentProduct.price = price;
    currentProduct.description = description;
    currentProduct.category = category;
    currentProduct.imageUrl = imageUrl;
    currentProduct.public_id = public_id;
    currentProduct.stock = stock;

    await currentProduct.save();
  } catch (err) {
    console.log("Error saat update produk ", err);
  }
};

// export const deleteProduct = async ({ id }: { id: string }) => {
//   const res = await fetch(`http://localhost:3000/api/products/delete/${id}`, {
//     method: "DELETE",
//   });
//   const data = await res.json();
//   return data.status;
// };

export const createTransaction = async ({ order_id, products, name, email, phone, address, city, postalCode, total }: NewCheckoutProps) => {
  try {
    await connectDB();
    const result = await Transaction.create({
      order_id,
      products,
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      total,
    });
    console.log("✅ Saved transaction:", result);
  } catch (err) {
    console.log("❌ Error saving transaction:", err);
  }
};

export const orderByMonth = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/monthly`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log("Error saat mengambil data monthly orders", err);
  }
};

export const getAllOrders = async () => {
  await connectDB();
  try {
    const allOrders = await Transaction.find({ status: "settlement" });
    return JSON.parse(JSON.stringify(allOrders));
  } catch (err) {
    console.log("Error saat mengambil data all orders", err);
  }
};

export const getAllProducts = async () => {
  try {
    const allProduct = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: "no-store" });
    const { data } = await allProduct.json();
    return data;
  } catch (err) {
    console.log("Error saat mengambil data all products", err);
    return [];
  }
};
