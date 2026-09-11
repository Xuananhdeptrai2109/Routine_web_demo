"use client";

import { SHIPPING_METHODS } from "@/lib/checkoutConstants";
import { formatPrice } from "@/lib/format";

export default function DeliveryMethod({ value, onChange }) {
  return (
    <div className="delivery-method-list" role="radiogroup" aria-label="Delivery method">
      {Object.values(SHIPPING_METHODS).map((method) => (
        <label
          key={method.id}
          className={`delivery-method-option ${value === method.id ? "is-active" : ""}`}
        >
          <input
            type="radio"
            name="delivery-method"
            value={method.id}
            checked={value === method.id}
            onChange={() => onChange(method.id)}
          />
          <span className="delivery-method-info">
            <span style={{ fontWeight: 500 }}>{method.label}</span>
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{method.eta}</span>
          </span>
          <span style={{ fontWeight: 600 }}>{formatPrice(method.fee)}</span>
        </label>
      ))}

      <style>{`
        .delivery-method-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .delivery-method-option {
          display: flex;
          align-items: center;
          gap: 14px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 16px;
          cursor: pointer;
          transition: border-color var(--transition-fast);
        }
        .delivery-method-option.is-active {
          border-color: var(--color-primary);
        }
        .delivery-method-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
      `}</style>
    </div>
  );
}
