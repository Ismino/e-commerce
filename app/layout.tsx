export const metadata = { title: "Catalog", description: "DummyJSON catalog" };

import "./globals.css";
import Providers from "./providers";
import CartDrawer from "@/components/CartDrawer";
import CartButton from "@/components/CartButton";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-neutral-50 text-neutral-900">
        <Providers>
          <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 p-3">
              <a href="/catalog" className="font-semibold tracking-tight">Catalog</a>
              <CartButton />
            </nav>
          </header>
          <main className="mx-auto max-w-6xl p-3">{children}</main>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}

