import AIStylistChat from "@/components/ai/AIStylistChat";

export const metadata = {
  title: "AI Stylist — Routine Thu Đông"
};

export default function AIStylistPage({ searchParams }) {
  const currentProductId = searchParams?.productId || null;
  const initialPrompt = searchParams?.prompt || (currentProductId ? "Gợi ý cho mình set đồ phối ăn ý nhất với sản phẩm này" : "");

  return (
    <div className="container section">
      <div className="section-header" style={{ marginBottom: 40 }}>
        <span className="eyebrow">Your personal fashion assistant</span>
        <h1 className="section-title" style={{ fontSize: 32 }}>
          AI STYLIST
        </h1>
      </div>
      <AIStylistChat
        currentProductId={currentProductId}
        initialPrompt={initialPrompt}
      />
    </div>
  );
}
