import { products, categories, featuredProducts, dealProducts } from "../data/mockData.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchProducts(filters = {}) {
  await delay(400);
  let result = [...products];

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.subcategory) {
    result = result.filter((p) => p.subcategory === filters.subcategory);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }
  if (filters.minPrice != null) {
    result = result.filter((p) => p.price >= filters.minPrice);
  }
  if (filters.maxPrice != null) {
    result = result.filter((p) => p.price <= filters.maxPrice);
  }
  if (filters.brand) {
    result = result.filter((p) => p.brand === filters.brand);
  }
  if (filters.sort) {
    switch (filters.sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.reverse();
        break;
      default:
        break;
    }
  }

  return result;
}

export async function fetchProductById(id) {
  await delay(300);
  return products.find((p) => p.id === id) || null;
}

export async function fetchCategories() {
  await delay(200);
  return categories;
}

export async function fetchFeaturedProducts() {
  await delay(300);
  return featuredProducts;
}

export async function fetchDealProducts() {
  await delay(300);
  return dealProducts;
}

export async function fetchRelatedProducts(category, excludeId, limit = 4) {
  await delay(300);
  return products
    .filter((p) => p.category === category && p.id !== excludeId)
    .slice(0, limit);
}

export function getAllBrands() {
  return [...new Set(products.map((p) => p.brand))].sort();
}

export function getPriceRange() {
  const prices = products.map((p) => p.price);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
}
