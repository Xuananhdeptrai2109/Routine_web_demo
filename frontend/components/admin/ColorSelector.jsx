"use client";

import { useState } from "react";
import { IconCheck } from "./icons";
import styles from "./selectors.module.css";

export default function ColorSelector({ colorOptions, value = [], onChange, error }) {
  const [customName, setCustomName] = useState("");
  const [customHex, setCustomHex] = useState("#2b5c8f");
  const [showAdd, setShowAdd] = useState(false);
  const [extraColors, setExtraColors] = useState([]);

  function toggle(id) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  }

  function handleAddCustom() {
    const trimmed = customName.trim();
    if (!trimmed) return;
    const customId = `color-${trimmed.toLowerCase().replace(/\s+/g, "-")}`;
    if (!extraColors.some((c) => c.id === customId) && !colorOptions.some((c) => c.id === customId || c.name.toLowerCase() === trimmed.toLowerCase())) {
      setExtraColors((prev) => [...prev, { id: customId, name: trimmed, hexCode: customHex }]);
    }
    if (!value.includes(customId)) {
      onChange([...value, customId]);
    }
    setCustomName("");
    setShowAdd(false);
  }

  const allColors = [...colorOptions, ...extraColors];
  (value || []).forEach((v) => {
    if (!allColors.some((c) => c.id === v || c.name === v)) {
      const label = String(v).replace(/^color-/, "");
      allColors.push({ id: v, name: label.charAt(0).toUpperCase() + label.slice(1), hexCode: "#666666" });
    }
  });

  return (
    <div className={styles.field}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
        <label className={styles.label}>Colors</label>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          style={{ background: "none", border: "none", color: "var(--color-primary, #000)", fontSize: "12px", cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}
        >
          {showAdd ? "Đóng" : "+ Thêm màu"}
        </button>
      </div>

      {showAdd && (
        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "8px" }}>
          <input
            type="text"
            placeholder="Tên màu (VD: Xanh Rêu, Hồng...)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCustom(); } }}
            style={{ padding: "5px 10px", fontSize: "12px", border: "1px solid var(--color-border, #ddd)", borderRadius: "4px", width: "150px" }}
          />
          <input
            type="color"
            value={customHex}
            onChange={(e) => setCustomHex(e.target.value)}
            style={{ width: "32px", height: "28px", padding: 0, border: "1px solid #ccc", cursor: "pointer", borderRadius: "4px" }}
            title="Chọn mã màu"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            style={{ padding: "5px 12px", fontSize: "12px", background: "var(--color-primary, #111)", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 500 }}
          >
            Thêm
          </button>
        </div>
      )}

      <div className={styles.swatchGrid} role="group" aria-label="Chọn màu sắc">
        {allColors.map((c) => {
          const active = value.includes(c.id) || value.includes(c.name);
          const isLight = c.hexCode?.toLowerCase() === "#ffffff";
          return (
            <button
              type="button"
              key={c.id}
              className={styles.swatchItem}
              onClick={() => toggle(c.id)}
              aria-pressed={active}
            >
              <span
                className={`${styles.swatchCircle} ${active ? styles.swatchCircleActive : ""}`}
                style={{ background: c.hexCode, borderColor: isLight ? "var(--color-border)" : c.hexCode }}
              >
                {active ? <IconCheck size={14} style={{ color: isLight ? "#111" : "#fff" }} /> : null}
              </span>
              <span className={styles.swatchLabel}>{c.name}</span>
            </button>
          );
        })}
      </div>
      {error ? <p className={styles.errorText}>{error}</p> : null}
    </div>
  );
}
