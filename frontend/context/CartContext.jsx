"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  loadCart,
  saveCart,
  makeCartLineId,
  calculateSubtotal,
  fetchCartApi,
  addItemApi,
  addBulkItemsApi,
  updateQuantityApi,
  removeItemApi,
  clearCartApi,
  mergeCartApi,
} from "@/lib/cartService";
import { useUser } from "@/context/UserContext";
import { fetchProductById } from "@/lib/productService";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const { isLoggedIn, openAuthPrompt } = useUser();

  // Khởi tạo ban đầu: Đọc localStorage trước cho nhanh, sau đó đồng bộ với MySQL Database
  useEffect(() => {
    const loaded = loadCart();
    setItems(loaded);
    setHydrated(true);

    async function syncWithDatabase() {
      try {
        const guestSessionId = typeof window !== "undefined" ? window.localStorage.getItem("routine_guest_session_id") : null;
        if (isLoggedIn && guestSessionId) {
          // Gộp giỏ hàng khách vào user nếu có
          await mergeCartApi(guestSessionId);
        }

        const remoteCart = await fetchCartApi();
        if (remoteCart && Array.isArray(remoteCart.items)) {
          if (remoteCart.items.length > 0) {
            setItems(remoteCart.items);
            saveCart(remoteCart.items);
          } else if (loaded.length > 0) {
            // Đưa các item từ localStorage lên MySQL Database
            await addBulkItemsApi(
              loaded.map((item) => ({
                productId: item.productId,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                image: item.image,
                name: item.name,
                price: item.price,
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Lỗi đồng bộ giỏ hàng với Database:", err.message);
      }
    }

    syncWithDatabase();
  }, [isLoggedIn]);

  // Luôn lưu cache localStorage để UI mượt mà
  useEffect(() => {
    if (hydrated) {
      saveCart(items);
    }
  }, [items, hydrated]);

  const addToCart = useCallback(
    (product, { size, color, quantity = 1 } = {}) => {
      // Yêu cầu đăng nhập trước khi thêm vào giỏ hàng
      if (!isLoggedIn) {
        openAuthPrompt({
          title: "Đăng nhập để thêm vào giỏ hàng",
          message: "Vui lòng đăng nhập hoặc tạo tài khoản Routine để thêm sản phẩm vào giỏ hàng và lưu lịch sử mua sắm của bạn.",
        });
        return false;
      }

      let mainImg = "";
      if (Array.isArray(product.images) && product.images.length > 0) {
        mainImg = product.images[0];
      } else if (typeof product.images === "string" && product.images.trim()) {
        try {
          const parsed = JSON.parse(product.images);
          mainImg = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : product.images;
        } catch {
          mainImg = product.images;
        }
      } else if (product.image) {
        mainImg = product.image;
      }

      const selectedSize = size || product.sizes?.[0] || "M";
      const selectedColor = color || product.colors?.[0] || "Đen";
      const lineId = makeCartLineId(product.id, selectedSize, selectedColor);

      // Cập nhật State tức thì (Optimistic UI)
      setItems((prev) => {
        const existing = prev.find((item) => item.lineId === lineId);
        if (existing) {
          return prev.map((item) =>
            item.lineId === lineId
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  image: item.image || mainImg,
                }
              : item
          );
        }
        return [
          ...prev,
          {
            lineId,
            productId: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: mainImg,
            images: Array.isArray(product.images) ? product.images : [mainImg].filter(Boolean),
            size: selectedSize,
            color: selectedColor,
            quantity,
          },
        ];
      });

      // Lưu vĩnh viễn vào MySQL Database qua Backend API
      addItemApi({
        productId: product.id,
        size: selectedSize,
        color: selectedColor,
        quantity,
        image: mainImg,
        name: product.name,
        price: product.price,
      }).catch((e) => console.warn("Lỗi lưu vào DB:", e.message));

      return true;
    },
    [isLoggedIn, openAuthPrompt]
  );

  const addOutfitToCart = useCallback(
    (productsList) => {
      if (!isLoggedIn) {
        openAuthPrompt({
          title: "Đăng nhập để mua outfit",
          message: "Vui lòng đăng nhập hoặc tạo tài khoản Routine để thêm toàn bộ outfit vào giỏ hàng của bạn.",
        });
        return false;
      }

      productsList.forEach((product) => addToCart(product, {}));
      return true;
    },
    [isLoggedIn, openAuthPrompt, addToCart]
  );

  const removeFromCart = useCallback((lineId) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
    removeItemApi(lineId).catch((e) => console.warn("Lỗi xóa khỏi DB:", e.message));
  }, []);

  const updateQuantity = useCallback((lineId, quantity) => {
    const validQty = Math.max(1, quantity);
    setItems((prev) =>
      prev
        .map((item) => (item.lineId === lineId ? { ...item, quantity: validQty } : item))
        .filter((item) => item.quantity > 0)
    );
    updateQuantityApi(lineId, validQty).catch((e) => console.warn("Lỗi cập nhật số lượng DB:", e.message));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    clearCartApi().catch((e) => console.warn("Lỗi dọn sạch DB:", e.message));
  }, []);

  const getCartTotal = useCallback(() => calculateSubtotal(items), [items]);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0), [items]);

  const subtotal = useMemo(() => calculateSubtotal(items), [items]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      hydrated,
      addToCart,
      addOutfitToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
    }),
    [items, itemCount, subtotal, hydrated, addToCart, addOutfitToCart, removeFromCart, updateQuantity, clearCart, getCartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
