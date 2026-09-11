"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/common/Toast";
import { formatPrice } from "@/lib/format";
import styles from "./InteractiveOutfitCard.module.css";

export default function InteractiveOutfitCard({ outfit }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const products = outfit?.products || [];
  // Lưu trạng thái size & color được chọn cho từng sản phẩm trong set
  const [selections, setSelections] = useState(() => {
    const initial = {};
    products.forEach((p) => {
      initial[p.id || p.productId] = {
        size: p.selectedSize || (Array.isArray(p.sizes) ? p.sizes[0] : "M"),
        color: p.selectedColor || (Array.isArray(p.colors) ? p.colors[0] : "Đen"),
      };
    });
    return initial;
  });

  const [adding, setAdding] = useState(false);

  function handleSizeChange(prodId, size) {
    setSelections((prev) => ({
      ...prev,
      [prodId]: { ...(prev[prodId] || {}), size },
    }));
  }

  function handleColorChange(prodId, color) {
    setSelections((prev) => ({
      ...prev,
      [prodId]: { ...(prev[prodId] || {}), color },
    }));
  }

  // 1-Click thêm toàn bộ set đồ vào giỏ hàng
  function handleAddEntireOutfit() {
    if (products.length === 0) return;
    setAdding(true);

    let addedCount = 0;
    products.forEach((p) => {
      const pid = p.id || p.productId;
      const sel = selections[pid] || {};
      const success = addToCart(p, {
        size: sel.size,
        color: sel.color,
        quantity: 1,
      });
      if (success !== false) addedCount++;
    });

    setAdding(false);
    if (addedCount > 0) {
      showToast(`✨ Đã thêm trọn bộ ${addedCount} sản phẩm vào giỏ hàng!`);
    }
  }

  // Thêm lẻ 1 sản phẩm
  function handleAddSingleItem(p) {
    const pid = p.id || p.productId;
    const sel = selections[pid] || {};
    const success = addToCart(p, {
      size: sel.size,
      color: sel.color,
      quantity: 1,
    });
    if (success !== false) {
      showToast(`Đã thêm "${p.name}" (${sel.size || "M"} - ${sel.color || "Đen"}) vào giỏ hàng!`);
    }
  }

  const total = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  return (
    <div className={styles.interactiveOutfitCard}>
      <div className={styles.outfitCardHeader}>
        <div>
          <span className={styles.outfitBadge}>{outfit.style ? outfit.style.toUpperCase() : "OUTFIT"}</span>
          <h3 className={styles.outfitTitle}>{outfit.title || outfit.name || "Bộ phối thời trang Routine"}</h3>
        </div>
        <span className={styles.outfitItemCount}>{products.length} món đồ</span>
      </div>

      <div className={styles.outfitItemsList}>
        {products.map((item) => {
          const pid = item.id || item.productId;
          const sel = selections[pid] || {};
          const sizes = Array.isArray(item.sizes) ? item.sizes : ["S", "M", "L", "XL"];
          const colors = Array.isArray(item.colors) ? item.colors : ["Đen", "Trắng", "Xám"];

          return (
            <div key={pid} className={styles.outfitItemRow}>
              <Link href={`/product/${pid}`} className={styles.outfitItemThumb}>
                <img src={item.image || "/images/placeholder.svg"} alt={item.name} />
              </Link>

              <div className={styles.outfitItemInfo}>
                <Link href={`/product/${pid}`} className={styles.outfitItemName}>
                  {item.name}
                </Link>
                <div className={styles.outfitItemPrice}>{formatPrice(item.price)}</div>

                <div className={styles.outfitItemSelectors}>
                  <div className={styles.selectorGroup}>
                    <label>Size:</label>
                    <select
                      value={sel.size}
                      onChange={(e) => handleSizeChange(pid, e.target.value)}
                      className={styles.miniSelect}
                    >
                      {sizes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.selectorGroup}>
                    <label>Màu:</label>
                    <select
                      value={sel.color}
                      onChange={(e) => handleColorChange(pid, e.target.value)}
                      className={styles.miniSelect}
                    >
                      {colors.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    className={styles.btnAddSingle}
                    onClick={() => handleAddSingleItem(item)}
                    title="Thêm riêng món này"
                  >
                    + Thêm món này
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.outfitCardFooter}>
        <div className={styles.outfitTotal}>
          <span className={styles.totalLabel}>Tổng set đồ:</span>
          <span className={styles.totalAmount}>{formatPrice(total)}</span>
        </div>

        <button
          type="button"
          className={`btn btn-primary ${styles.btnAddAll}`}
          onClick={handleAddEntireOutfit}
          disabled={adding}
        >
          {adding ? "Đang thêm..." : "🛍️ Thêm trọn bộ vào giỏ hàng"}
        </button>
      </div>
    </div>
  );
}
