// Mock data — sẽ được thay bằng bảng `colors` khi có backend thật.
export const colors = [
  { id: "color-black", name: "Black", hexCode: "#111111", status: "ACTIVE" },
  { id: "color-white", name: "White", hexCode: "#FFFFFF", status: "ACTIVE" },
  { id: "color-grey", name: "Grey", hexCode: "#9a9a9a", status: "ACTIVE" },
  { id: "color-navy", name: "Navy", hexCode: "#1f2a44", status: "ACTIVE" },
  { id: "color-beige", name: "Beige", hexCode: "#e4d3b8", status: "ACTIVE" },
  { id: "color-olive", name: "Olive", hexCode: "#6b6e3a", status: "ACTIVE" },
  { id: "color-brown", name: "Brown", hexCode: "#6b4a34", status: "ACTIVE" },
  { id: "color-cream", name: "Cream", hexCode: "#f1ead8", status: "ACTIVE" },
  { id: "color-denim", name: "Denim Blue", hexCode: "#3e5c76", status: "ACTIVE" },
];

export function getColorById(id) {
  if (!id) return null;
  const needle = String(id).trim().toLowerCase();
  return (
    colors.find((c) => {
      const cId = c.id.toLowerCase();
      const cName = c.name.toLowerCase();
      if (cId === needle || cName === needle) return true;
      if (needle === "den" || needle === "đen") return cId === "color-black";
      if (needle === "trang" || needle === "trắng") return cId === "color-white";
      if (needle === "xam" || needle === "xám") return cId === "color-grey";
      if (needle === "xanh" || needle === "xanh navy" || needle === "navy") return cId === "color-navy";
      if (cId.replace("color-", "") === needle) return true;
      return false;
    }) || null
  );
}
