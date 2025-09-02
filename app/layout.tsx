export const metadata = {
  title: { default: "Bloom Boutique", template: "%s | Bloom Boutique" },
  description: "En färgglad produktkatalog med sök, filter, sortering och varukorg.",
};

import "./globals.css";
import Providers from "./providers";
import CartDrawer from "@/components/CartDrawer";
import CartButton from "@/components/CartButton";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

// Google Font via next/font 
import { Satisfy } from "next/font/google";
const satisfy = Satisfy({ weight: "400", subsets: ["latin"] });

function Brand() {
  return (
    <a href="/catalog" className={`${satisfy.className} text-xl md:text-2xl`}>
      Bloom Boutique
    </a>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-gradient-to-br from-rose-50 via-white to-sky-50 text-neutral-900">
        <Providers>
          <header className="sticky top-0 z-10 border-b border-white/20 bg-gradient-to-r from-rose-500 to-sky-500 text-white shadow-sm">
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 p-3">
              <Brand />
              <CartButton />
            </nav>
          </header>

          <main className="relative mx-auto max-w-6xl p-4">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
              <div className="h-full w-full bg-[radial-gradient(60%_60%_at_8%_10%,rgba(244,63,94,0.08),transparent),radial-gradient(50%_50%_at_95%_0%,rgba(56,189,248,0.08),transparent)]" />
            </div>
            {children}
          </main>

          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
