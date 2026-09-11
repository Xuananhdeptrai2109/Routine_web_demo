import { stockStatus, slugify } from "@/data/products";
import { readStore, writeStore, delay, generateId } from "./mockStorage";
import { fetchApi } from "./api";

const STORAGE_KEY = "routine_admin_products_v1";

function loadAll() {
  return readStore(STORAGE_KEY, []);
}

function saveAll(list) {
  writeStore(STORAGE_KEY, list);
}

function matchesFilters(product, filters) {
  const { search, categoryId, gender, styleId, status, stock } = filters || {};

  if (search) {
    const needle = search.trim().toLowerCase();
    const nameMatch = product.name?.toLowerCase().includes(needle);
    const skuMatch = product.variants?.some((v) => v.sku?.toLowerCase().includes(needle));
    if (!nameMatch && !skuMatch) return false;
  }

  const prodCat = product.categoryId || product.category;
  if (categoryId && categoryId !== "ALL" && prodCat !== categoryId) return false;

  const prodGender = (product.gender || "").toUpperCase();
  if (gender && gender !== "ALL" && prodGender !== gender.toUpperCase()) return false;

  const prodStyles = product.styleIds || (Array.isArray(product.style) ? product.style : [product.style].filter(Boolean));
  if (styleId && styleId !== "ALL" && !prodStyles.includes(styleId)) return false;

  if (status && status !== "ALL" && (product.status || "ACTIVE") !== status) return false;

  if (stock && stock !== "ALL") {
    const current = stockStatus(product);
    if (stock === "IN_STOCK" && current !== "IN_STOCK") return false;
    if (stock === "LOW_STOCK" && current !== "LOW_STOCK") return false;
    if (stock === "OUT_OF_STOCK" && current !== "OUT_OF_STOCK") return false;
  }

  return true;
}

export async function getProducts(filters = {}) {
  try {
    const data = await fetchApi('/products?limit=100');
    if (data && Array.isArray(data.items) && data.items.length > 0) {
      // Sync local cache
      saveAll(data.items);
      return data.items.filter((p) => matchesFilters(p, filters));
    }
  } catch (err) {
    console.warn('[adminProductService] Backend fetch failed, using local store:', err.message);
  }

  const all = loadAll();
  return all.filter((p) => matchesFilters(p, filters));
}

export async function getProductById(id) {
  try {
    const data = await fetchApi(`/products/${id}`);
    if (data && data.id) {
      return data;
    }
  } catch (err) {
    console.warn(`[adminProductService] Failed to fetch product ${id}:`, err.message);
  }

  const all = loadAll();
  return all.find((p) => p.id === id) || null;
}

export async function isSkuTaken(sku, excludeProductId = null) {
  try {
    const query = excludeProductId
      ? `?sku=${encodeURIComponent(sku)}&excludeProductId=${excludeProductId}&excludeId=${excludeProductId}`
      : `?sku=${encodeURIComponent(sku)}`;
    const data = await fetchApi(`/products/check-sku${query}`);
    if (data && typeof data.isAvailable === 'boolean') {
      return !data.isAvailable;
    }
  } catch (err) {
    // fallback
  }

  const all = loadAll();
  const needle = sku.trim().toLowerCase();
  return all.some(
    (p) => p.id !== excludeProductId && p.variants?.some((v) => v.sku?.trim().toLowerCase() === needle)
  );
}

export async function createProduct(input) {
  try {
    const data = await fetchApi('/products', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (data && data.id) {
      const all = loadAll();
      saveAll([data, ...all.filter((p) => p.id !== data.id)]);
      return data;
    }
  } catch (err) {
    console.warn('[adminProductService] Create API failed, using local store:', err.message);
  }

  await delay();
  const all = loadAll();
  const id = generateId("p");
  const product = {
    ...input,
    id,
    slug: input.slug || slugify(input.name),
    createdAt: new Date().toISOString(),
  };
  const next = [product, ...all];
  saveAll(next);
  return product;
}

export async function updateProduct(id, input) {
  try {
    const data = await fetchApi(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
    if (data && data.id) {
      const all = loadAll();
      const index = all.findIndex((p) => p.id === id);
      const next = [...all];
      if (index !== -1) {
        next[index] = { ...next[index], ...data };
      } else {
        next.unshift(data);
      }
      saveAll(next);
      return data;
    }
    return data;
  } catch (err) {
    console.error(`[adminProductService] Update API failed for ${id}:`, err);
    throw err;
  }
}

export async function deleteProduct(id) {
  try {
    await fetchApi(`/products/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn(`[adminProductService] Delete API failed for ${id}:`, err.message);
  }

  const all = loadAll();
  const next = all.filter((p) => p.id !== id);
  saveAll(next);
  return { success: true };
}

export async function duplicateProduct(id) {
  try {
    const data = await fetchApi(`/products/${id}/duplicate`, { method: 'POST' });
    if (data && data.id) {
      const all = loadAll();
      saveAll([data, ...all]);
      return data;
    }
  } catch (err) {
    console.warn(`[adminProductService] Duplicate API failed for ${id}:`, err.message);
  }

  await delay();
  const all = loadAll();
  const source = all.find((p) => p.id === id);
  if (!source) throw new Error("Không tìm thấy sản phẩm.");
  const newId = generateId("p");
  const duplicated = {
    ...source,
    id: newId,
    name: `${source.name} (Copy)`,
    slug: slugify(`${source.name}-copy-${newId}`),
    status: "DRAFT",
    createdAt: new Date().toISOString(),
    images: source.images.map((img, i) => ({ ...img, id: `${newId}-img${i + 1}`, productId: newId })),
    variants: source.variants?.map((v, i) => ({
      ...v,
      id: `${newId}-v${String(i + 1).padStart(2, "0")}`,
      productId: newId,
      sku: `${v.sku}-COPY`,
    })) || [],
  };
  const next = [duplicated, ...all];
  saveAll(next);
  return duplicated;
}

export async function resetProducts() {
  await delay(100);
  saveAll(seedProducts);
  return seedProducts;
}
