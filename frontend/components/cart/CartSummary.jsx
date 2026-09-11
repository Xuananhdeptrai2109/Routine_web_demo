"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useToast } from "@/components/common/Toast";
import { useCheckout } from "@/context/CheckoutContext";
import { getShippingFee } from "@/lib/checkoutConstants";

export default function CartSummary({ subtotal, checkoutHref = "/checkout", ctaLabel = "Proceed to Checkout" }) {
  const { shippingMethod, voucherCode, discount, applyVoucher } = useCheckout();
  const [inputCode, setInputCode] = useState(voucherCode || "");
  const { showToast } = useToast();

  const shipping = subtotal === 0 ? 0 : getShippingFee(shippingMethod);
  const total = Math.max(subtotal + shipping - discount, 0);

  function handleApplyVoucher(e) {
    e.preventDefault();
    if (!inputCode.trim()) return;
    if (inputCode.trim().toUpperCase() === "ROUTINE10") {
      const value = Math.round(subtotal * 0.1);
      applyVoucher(inputCode.trim().toUpperCase(), value);
      showToast("Áp dụng mã giảm giá thành công.");
    } else {
      applyVoucher("", 0);
      showToast("Mã giảm giá không hợp lệ.");
    }
  }

  return (
    <div className="cart-summary">
      <h2 style={{ fontSize: 16, marginBottom: 20, letterSpacing: "0.04em" }}>ORDER SUMMARY</h2>

      <form onSubmit={handleApplyVoucher} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          className="input"
          style={{ flex: 1 }}
          placeholder="Enter promo code"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          aria-label="Mã giảm giá"
        />
        <button type="submit" className="btn btn-secondary btn-sm">
          Apply
        </button>
      </form>

      <div className="cart-summary-row">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="cart-summary-row">
        <span>Shipping</span>
        <span>{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</span>
      </div>
      {discount > 0 && (
        <div className="cart-summary-row" style={{ color: "var(--color-success)" }}>
          <span>Discount</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}

      <div className="cart-summary-row cart-summary-total">
        <span>TOTAL</span>
        <span>{formatPrice(total)}</span>
      </div>

      <Link href={checkoutHref} className="btn btn-primary btn-full" style={{ marginTop: 20 }}>
        {ctaLabel}
      </Link>

      <style>{`
        .cart-summary {
          background: var(--color-bg-secondary);
          border-radius: var(--radius-md);
          padding: 24px;
        }
        .cart-summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 14px;
          color: var(--color-text-secondary);
        }
        .cart-summary-total {
          border-top: 1px solid var(--color-border);
          margin-top: 8px;
          padding-top: 16px;
          font-weight: 600;
          font-size: 16px;
          color: var(--color-text);
        }
      `}</style>
    </div>
  );
}
