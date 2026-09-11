import Link from "next/link";

export default function Logo({ className = "" }) {
  return (
    <Link
      href="/"
      className={className}
      aria-label="Routine — về trang chủ"
      style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.14em" }}
    >
      ROUTINE
    </Link>
  );
}
