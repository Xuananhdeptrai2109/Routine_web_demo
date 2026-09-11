"use client";

import { formatPrice } from "@/lib/format";
import { getShippingFee } from "@/lib/checkoutConstants";

export default function CheckoutSummary({
  subtotal,
  shippingMethod,
  discount = 0,
  onContinue,
  ctaLabel = "Continue to Payment",
  disabled = false
}) {
  const shipping = getShippingFee(shippingMethod);
  const total = Math.max(subtotal + shipping - discount, 0);

  return (
    <div className="checkout-summary">
      <h2 style={{ fontSize: 16, marginBottom: 20, letterSpacing: "0.04em" }}>ORDER SUMMARY</h2>

      <div className="checkout-summary-row">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="checkout-summary-row">
        <span>Shipping</span>
        <span>{formatPrice(shipping)}</span>
      </div>
      {discount > 0 && (
        <div className="checkout-summary-row" style={{ color: "var(--color-success)" }}>
          <span>Discount</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}

      <div className="checkout-summary-row checkout-summary-total">
        <span>TOTAL</span>
        <span>{formatPrice(total)}</span>
      </div>

      {onContinue && (
        <button className="btn btn-primary btn-full" style={{ marginTop: 20 }} onClick={onContinue} disabled={disabled}>
          {ctaLabel}
        </button>
      )}

      <style>{`
        .checkout-summary {
          background: var(--color-bg-secondary);
          border-radius: var(--radius-md);
          padding: 24px;
          position: sticky;
          top: calc(var(--header-height) + 24px);
        }
        .checkout-summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 14px;
          color: var(--color-text-secondary);
        }
        .checkout-summary-total {
          border-top: 1px solid var(--color-border);
          margin-top: 8px;
          padding-top: 16px;
          font-weight: 600;
          font-size: 16px;
          color: var(--color-text);
        }
        @media (max-width: 1023px) {
          .checkout-summary { position: static; }
        }
      `}</style>
    </div>
  );
}
