import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { RegistrationProvider } from "@/context/RegistrationContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import { OrderProvider } from "@/context/OrderContext";
import { ToastProvider } from "@/components/common/Toast";
import AppShell from "@/components/layout/AppShell";

export const metadata = {
  title: "Routine — Smart Fashion",
  description:
    "Routine — nền tảng thời trang tối giản giúp bạn khám phá sản phẩm, xây dựng outfit và nhận gợi ý phong cách cá nhân."
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <UserProvider>
          <RegistrationProvider>
            <WishlistProvider>
              <CartProvider>
                <OrderProvider>
                  <CheckoutProvider>
                    <ToastProvider>
                      <AppShell>{children}</AppShell>
                    </ToastProvider>
                  </CheckoutProvider>
                </OrderProvider>
              </CartProvider>
            </WishlistProvider>
          </RegistrationProvider>
        </UserProvider>
      </body>
    </html>
  );
}
