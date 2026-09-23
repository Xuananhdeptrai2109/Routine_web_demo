"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@/components/common/Icons";

const columns = [
  {
    title: "SHOP",
    links: [
      { label: "Men", href: "/category/men" },
      { label: "Women", href: "/category/women" },
      { label: "Unisex", href: "/category/unisex" },
      { label: "New Arrivals", href: "/category/new-arrivals" }
    ]
  },
  {
    title: "SMART FASHION",
    links: [
      { label: "Smart Outfit", href: "/smart-outfit" },
      { label: "AI Stylist", href: "/smart-outfit/ai-stylist" },
      { label: "Style Profile", href: "/wishlist" }
    ]
  },
  {
    title: "ABOUT",
    links: [
      { label: "Hotline: 0901 800 888", href: "tel:0901800888" },
      { label: "Email: cskh.routine@gmail.com", href: "mailto:cskh.routine@gmail.com" },
      { label: "Địa chỉ: 123 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM", href: "#" }
    ]
  }
];

const social = ["Facebook", "Instagram", "TikTok"];

function FooterColumn({ title, links }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid var(--color-border)" }} className="footer-col">
      <button
        className="footer-col-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 0",
          fontSize: 13,
          letterSpacing: "0.08em",
          fontWeight: 600
        }}
      >
        {title}
        <span className="footer-col-icon">
          <ChevronDownIcon style={{ transform: open ? "rotate(180deg)" : "none" }} />
        </span>
      </button>
      <ul className={`footer-col-links ${open ? "is-open" : ""}`}>
        {links.map((link) => (
          <li key={link.label} style={{ padding: "8px 0" }}>
            <Link href={link.href} style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: "var(--color-bg-secondary)", marginTop: 40 }}>
      <div className="container footer-container">
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.14em" }}>ROUTINE</span>
        </div>

        <div className="footer-grid">
          {columns.map((col) => (
            <FooterColumn key={col.title} {...col} />
          ))}
        </div>

        <div
          style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>© 2026 Routine Smart Fashion</p>
          <div style={{ display: "flex", gap: 16 }}>
            {social.map((s) => (
              <a key={s} href="#" style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-container {
          padding-top: 56px;
          padding-bottom: 32px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .footer-col-icon { display: none; }
        .footer-col-links { display: block; }
        @media (max-width: 767px) {
          .footer-container {
            padding-top: 40px;
            padding-bottom: 24px;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .footer-col-icon { display: inline-flex; }
          .footer-col-links { display: none; }
          .footer-col-links.is-open { display: block; padding-bottom: 8px; }
        }
      `}</style>
    </footer>
  );
}
