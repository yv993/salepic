import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionProvider } from "@/components/motion-provider";
import { LenisProvider } from "@/components/motion/lenis-provider";
import { CustomCursor } from "@/components/motion/custom-cursor";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { isClerkConfigured } from "@/lib/clerk-config";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE = "Posted. — Original postcard art by Tatevik Papyan";
const DESCRIPTION =
  "Hand-illustrated postcards by Tatevik Papyan. Browse limited prints by destination, season, and mood — printed on A6 card stock and ready to mail.";

export const metadata: Metadata = {
  metadataBase: new URL("https://posted.example"),
  title: {
    default: SITE,
    template: "%s · Posted.",
  },
  description: DESCRIPTION,
  openGraph: {
    title: SITE,
    description: DESCRIPTION,
    type: "website",
    siteName: "Posted.",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tree = (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Mark JS as available before paint so scroll-reveal arms only with JS
            (content stays visible for no-JS / crawlers). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{document.documentElement.classList.add('js')}catch(e){}",
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MotionProvider>
            <LenisProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </LenisProvider>
            <CustomCursor />
          </MotionProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );

  // Only mount ClerkProvider when real keys are configured — the example
  // placeholder key crashes Clerk on the client. Without it, the public store
  // renders fully and /admin shows the "configure Clerk" state.
  if (!isClerkConfigured()) return tree;

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#c0533b",
          colorBackground: "#fffdf8",
          colorText: "#2a2420",
          colorInputBackground: "#fffdf8",
          colorInputText: "#2a2420",
          colorTextSecondary: "#8a7c69",
          borderRadius: "0.75rem",
        },
      }}
    >
      {tree}
    </ClerkProvider>
  );
}
