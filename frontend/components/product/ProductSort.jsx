"use client";

const options = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" }
];

export default function ProductSort({ value, onChange }) {
  return (
    <div className="field" style={{ minWidth: 180 }}>
      <label htmlFor="product-sort" className="visually-hidden">
        Sắp xếp
      </label>
      <select
        id="product-sort"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
