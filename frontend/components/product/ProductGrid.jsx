import ProductCard from "./ProductCard";
import EmptyState from "@/components/common/EmptyState";

export default function ProductGrid({ products, emptyTitle = "Không tìm thấy sản phẩm", emptyDescription }) {
  if (!products || products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
