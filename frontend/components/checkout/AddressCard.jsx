"use client";

export default function AddressCard({ address, onEdit }) {
  if (!address) return null;

  return (
    <div className="address-card">
      <label className="address-card-radio">
        <input type="radio" name="address-choice" defaultChecked readOnly />
        <span>Use this address</span>
      </label>

      <div className="address-card-body">
        <p style={{ fontWeight: 600 }}>{address.name}</p>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>{address.phone}</p>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginTop: 6, lineHeight: 1.6 }}>
          {address.address},<br />
          {address.ward && <>{address.ward}, </>}
          {address.district},<br />
          {address.city}
        </p>
      </div>

      <button type="button" className="text-link" style={{ borderBottom: "none" }} onClick={onEdit}>
        Edit
      </button>

      <style>{`
        .address-card {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 20px;
        }
        .address-card-radio {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .address-card-body {
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
}
