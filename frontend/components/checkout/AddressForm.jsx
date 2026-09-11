"use client";

import { useState } from "react";
import { validateAddressForm, isFormValid } from "@/lib/validators";

const emptyValues = { name: "", phone: "", address: "", city: "", district: "", ward: "" };

export default function AddressForm({ initialValues, onSave, onCancel }) {
  const [values, setValues] = useState({ ...emptyValues, ...initialValues });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Address form only owns delivery fields; email isn't part of it,
    // so validate against a copy that always passes the email check.
    const nextErrors = validateAddressForm({ ...values, email: "placeholder@ok.com" });
    setErrors(nextErrors);
    if (isFormValid(nextErrors)) {
      onSave(values);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <div className="address-form-grid">
        <div className="field">
          <label htmlFor="addr-name">Họ và tên</label>
          <input
            id="addr-name"
            className="input"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="addr-phone">Số điện thoại</label>
          <input
            id="addr-phone"
            className="input"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="0912345678"
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>

        <div className="field address-form-full">
          <label htmlFor="addr-address">Địa chỉ</label>
          <input
            id="addr-address"
            className="input"
            value={values.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Số nhà, tên đường"
          />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </div>

        <div className="field">
          <label htmlFor="addr-city">Tỉnh/Thành phố</label>
          <input
            id="addr-city"
            className="input"
            value={values.city}
            onChange={(e) => update("city", e.target.value)}
          />
          {errors.city && <span className="field-error">{errors.city}</span>}
        </div>

        <div className="field">
          <label htmlFor="addr-district">Quận/Huyện</label>
          <input
            id="addr-district"
            className="input"
            value={values.district}
            onChange={(e) => update("district", e.target.value)}
          />
          {errors.district && <span className="field-error">{errors.district}</span>}
        </div>

        <div className="field">
          <label htmlFor="addr-ward">Phường/Xã</label>
          <input
            id="addr-ward"
            className="input"
            value={values.ward}
            onChange={(e) => update("ward", e.target.value)}
          />
          {errors.ward && <span className="field-error">{errors.ward}</span>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button type="submit" className="btn btn-primary">
          {onCancel ? "Save Address" : "+ Add New Address"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <style>{`
        .address-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .address-form-full { grid-column: span 2; }
        .field-error {
          font-size: 12px;
          color: var(--color-error);
        }
        @media (max-width: 640px) {
          .address-form-grid { grid-template-columns: 1fr; }
          .address-form-full { grid-column: span 1; }
        }
      `}</style>
    </form>
  );
}
