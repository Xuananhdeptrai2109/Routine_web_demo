import AIStylistChat from "@/components/ai/AIStylistChat";

export const metadata = {
  title: "AI Stylist — Routine"
};

export default function AIStylistPage() {
  return (
    <div className="container section">
      <div className="section-header" style={{ marginBottom: 40 }}>
        <span className="eyebrow">Your personal fashion assistant</span>
        <h1 className="section-title" style={{ fontSize: 32 }}>
          AI STYLIST
        </h1>
      </div>
      <AIStylistChat />
    </div>
  );
}
