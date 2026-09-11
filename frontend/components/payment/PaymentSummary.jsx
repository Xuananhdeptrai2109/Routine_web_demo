"use client";

import { formatPrice } from "@/lib/format";
import { getShippingFee } from "@/lib/checkoutConstants";

export default function PaymentSummary({ subtotal, shippingMethod, discount = 0, onPlaceOrder, isProcessing, error }) {
  const shipping = getShippingFee(shippingMethod);
  const total = Math.max(subtotal + shipping - discount, 0);

  return (
    <div className="payment-summary">
      <h2 style={{ fontSize: 16, marginBottom: 20, letterSpacing: "0.04em" }}>ORDER SUMMARY</h2>

      <div className="payment-summary-row">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="payment-summary-row">
        <span>Shipping</span>
        <span>{formatPrice(shipping)}</span>
      </div>
      {discount > 0 && (
        <div className="payment-summary-row" style={{ color: "var(--color-success)" }}>
          <span>Discount</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}

      <div className="payment-summary-row payment-summary-total">
        <span>TOTAL</span>
        <span>{formatPrice(total)}</span>
      </div>

      {error && (
        <div className="payment-error" role="alert">
          <p style={{ fontWeight: 600, marginBottom: 4 }}>PAYMENT FAILED</p>
          <p style={{ fontSize: 13 }}>{error}</p>
        </div>
      )}

      <button className="btn btn-primary btn-full" style={{ marginTop: 20 }} onClick={onPlaceOrder} disabled={isProcessing}>
        {isProcessing ? "Processing..." : error ? "Try Again" : "Place Order"}
      </button>

      <style>{`
        .payment-summary {
          background: var(--color-bg-secondary);
          border-radius: var(--radius-md);
          padding: 24px;
          position: sticky;
          top: calc(var(--header-height) + 24px);
        }
        .payment-summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 14px;
          color: var(--color-text-secondary);
        }
        .payment-summary-total {
          border-top: 1px solid var(--color-border);
          margin-top: 8px;
          padding-top: 16px;
          font-weight: 600;
          font-size: 16px;
          color: var(--color-text);
        }
        .payment-error {
          margin-top: 16px;
          padding: 14px;
          border-radius: var(--radius-sm);
          background: rgba(217, 48, 37, 0.08);
          color: var(--color-error);
        }
        @media (max-width: 1023px) {
          .payment-summary { position: static; }
        }
      `}</style>
    </div>
  );
}
