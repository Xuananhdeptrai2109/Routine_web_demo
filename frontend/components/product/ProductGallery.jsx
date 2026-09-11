"use client";

import { useState } from "react";
import PlaceholderImage from "@/components/common/PlaceholderImage";

export default function ProductGallery({ images = [], productName = "Product" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rawList = Array.isArray(images) ? images : [images].filter(Boolean);
  const safeImages = rawList.length > 0 ? rawList : ["/images/placeholder.jpg"];
  const currentImg = safeImages[activeIndex] || safeImages[0];

  return (
    <div>
      {/* Khung ảnh chính sắc nét */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 5",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          backgroundColor: "var(--color-bg-secondary, #f8f8f8)",
          border: "1px solid var(--color-border, #eaeaea)"
        }}
      >
        {currentImg && !currentImg.includes("undefined") ? (
          <img
            src={currentImg}
            alt={productName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "opacity 0.2s ease"
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              if (e.currentTarget.nextSibling) {
                e.currentTarget.nextSibling.style.display = "flex";
              }
            }}
          />
        ) : null}
        <div style={{ display: currentImg ? "none" : "flex", width: "100%", height: "100%" }}>
          <PlaceholderImage label={`${productName} ${activeIndex + 1}`} ratio="4 / 5" rounded />
        </div>
      </div>

      {/* Danh sách ảnh thu nhỏ thumbnails */}
      {safeImages.length > 1 && (
        <div style={{ display: "flex", gap: 10, marginTop: 12, overflowX: "auto", paddingBottom: 4 }}>
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Xem ảnh ${idx + 1}`}
              aria-pressed={activeIndex === idx}
              style={{
                width: 64,
                height: 80,
                flexShrink: 0,
                padding: 0,
                border: activeIndex === idx ? "2px solid var(--color-primary, #000)" : "1px solid var(--color-border, #eaeaea)",
                borderRadius: "var(--radius-sm)",
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: "#f8f8f8",
                position: "relative"
              }}
            >
              {img && !img.includes("undefined") ? (
                <img
                  src={img}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.nextSibling) {
                      e.currentTarget.nextSibling.style.display = "flex";
                    }
                  }}
                />
              ) : null}
              <div style={{ display: img ? "none" : "flex", width: "100%", height: "100%" }}>
                <PlaceholderImage label={`${idx + 1}`} ratio="4 / 5" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
