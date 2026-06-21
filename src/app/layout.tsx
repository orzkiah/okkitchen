import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "@/components/providers";
import { THEME_COOKIE } from "@/components/theme-provider";
import { SITE } from "@/lib/constants";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "ready to cook",
    "makanan siap masak",
    "bahan segar",
    "O'K Kitchen",
    "ikan nila bumbu kuning",
    "ayam pop",
  ],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "id_ID",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const theme = (await cookies()).get(THEME_COOKIE)?.value === "dark" ? "dark" : "light";

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${jakarta.variable} h-full ${theme === "dark" ? "dark" : ""}`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers initialTheme={theme}>{children}</Providers>
      </body>
    </html>
  );
}
