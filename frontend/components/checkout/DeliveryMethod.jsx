"use client";

import { useMemo } from "react";
import { getShippingMethods } from "@/lib/checkoutConstants";
import { formatPrice } from "@/lib/format";
import { useCheckout } from "@/context/CheckoutContext";

export default function DeliveryMethod({ value, onChange, address: propAddress }) {
  const checkout = useCheckout();
  const currentAddress = propAddress !== undefined ? propAddress : checkout?.address;

  const methods = useMemo(() => {
    return Object.values(getShippingMethods(currentAddress));
  }, [currentAddress]);

  return (
    <div className="delivery-method-list" role="radiogroup" aria-label="Delivery method">
      {methods.map((method) => (
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
            <span style={{ fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
              {method.label}
              {method.zoneName && (
                <span className="zone-badge">{method.zoneName}</span>
              )}
            </span>
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
        .zone-badge {
          font-size: 11px;
          font-weight: 500;
          color: var(--color-text-secondary);
          background: rgba(0, 0, 0, 0.05);
          padding: 2px 6px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
