import AdminLayout from "@/components/admin/AdminLayout";
import ToastProvider from "@/components/admin/ToastProvider";

export const metadata = {
  title: "ROUTINE Admin",
};

export default function AdminSegmentLayout({ children }) {
  return (
    <ToastProvider>
      <AdminLayout>{children}</AdminLayout>
    </ToastProvider>
  );
}
