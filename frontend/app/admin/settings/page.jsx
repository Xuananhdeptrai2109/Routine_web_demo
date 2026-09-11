import PlaceholderPage from "@/components/admin/PlaceholderPage";
import { IconSettings } from "@/components/admin/icons";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      subtitle="Cấu hình hệ thống"
      icon={<IconSettings size={20} />}
      message="System settings will be connected to backend later."
    />
  );
}
