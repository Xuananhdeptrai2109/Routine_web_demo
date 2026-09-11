"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import ProductFilters from "@/components/admin/ProductFilters";
import ProductTable from "@/components/admin/ProductTable";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastProvider";
import { IconPlus, IconTrash } from "@/components/admin/icons";
import { getProducts, deleteProduct, duplicateProduct } from "@/lib/adminProductService";
import { getCategories } from "@/lib/categoryService";
import { getStyles } from "@/lib/styleService";
import styles from "./page.module.css";

const DEFAULT_FILTERS = {
  search: "",
  categoryId: "ALL",
  gender: "ALL",
  styleId: "ALL",
  status: "ALL",
  stock: "ALL",
};

export default function ProductsPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [allStyles, setAllStyles] = useState([]);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [products, setProducts] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null); // "bulk" | product | null
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    getCategories().then((cats) => {
      if (active && Array.isArray(cats)) setCategories(cats);
    });
    getStyles().then((sts) => {
      if (active && Array.isArray(sts)) setAllStyles(sts);
    });
    return () => {
      active = false;
    };
  }, []);

  async function loadProducts() {
    const data = await getProducts(filters);
    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  function toggleSelectAll(checked) {
    setSelectedIds(checked ? (products || []).map((p) => p.id) : []);
  }

  async function handleDuplicate(product) {
    await duplicateProduct(product.id);
    showToast(`Đã nhân bản “${product.name}”.`, "success");
    loadProducts();
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      if (pendingDelete === "bulk") {
        await Promise.all(selectedIds.map((id) => deleteProduct(id)));
        showToast(`Đã xoá ${selectedIds.length} sản phẩm.`, "success");
        setSelectedIds([]);
      } else if (pendingDelete) {
        await deleteProduct(pendingDelete.id);
        showToast(`Đã xoá “${pendingDelete.name}”.`, "success");
        setSelectedIds((prev) => prev.filter((id) => id !== pendingDelete.id));
      }
      await loadProducts();
    } catch (err) {
      showToast(err?.message || "Không thể xoá sản phẩm.", "error");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog"
        actions={
          <Link href="/admin/products/new" className={styles.addBtn}>
            <IconPlus size={16} /> Add Product
          </Link>
        }
      />

      <ProductFilters filters={filters} onChange={handleFilterChange} categories={categories} styleOptions={allStyles} />

      {selectedIds.length > 0 ? (
        <div className={styles.bulkBar}>
          <span>{selectedIds.length} sản phẩm được chọn</span>
          <button type="button" className={styles.bulkDeleteBtn} onClick={() => setPendingDelete("bulk")}>
            <IconTrash size={14} /> Delete selected
          </button>
        </div>
      ) : null}

      {products === null ? (
        <p className={styles.loadingText}>Đang tải sản phẩm…</p>
      ) : (
        <ProductTable
          products={products}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onDuplicate={handleDuplicate}
          onDeleteRequest={setPendingDelete}
        />
      )}

      <ConfirmModal
        open={!!pendingDelete}
        title={pendingDelete === "bulk" ? "Xoá các sản phẩm đã chọn?" : `Xoá “${pendingDelete?.name}”?`}
        description="Hành động này không thể hoàn tác."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
