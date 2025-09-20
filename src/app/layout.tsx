import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catholic Missal - Daily Mass Readings",
  description: "Daily Catholic Mass readings with beautiful, reverent design. Access today's liturgical readings, responsorial psalms, and Gospel for your daily prayer and worship.",
  keywords: [
    "Catholic",
    "Missal",
    "Mass readings",
    "liturgical calendar",
    "daily readings",
    "Gospel",
    "Catholic prayers",
    "liturgy",
    "Roman Catholic",
    "spiritual reading"
  ],
  authors: [{ name: "Catholic Missal App" }],
  creator: "Catholic Missal App",
  publisher: "Catholic Missal App",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Catholic Missal - Daily Mass Readings",
    description: "Daily Catholic Mass readings with beautiful, reverent design for your spiritual journey.",
    type: "website",
    locale: "en_US",
    siteName: "Catholic Missal"
  },
  twitter: {
    card: "summary_large_image",
    title: "Catholic Missal - Daily Mass Readings",
    description: "Daily Catholic Mass readings with beautiful, reverent design.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes if needed
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Font preconnections */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme colors */}
        <meta name="theme-color" content="#d4af37" />
        <meta name="msapplication-TileColor" content="#d4af37" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />

        {/* Apple PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Catholic Missal" />

        {/* Viewport for PWA */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className="min-h-screen bg-background text-foreground font-serif antialiased">
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-liturgical-gold focus:text-white focus:rounded focus:shadow-lg"
        >
          Skip to main content
        </a>

        <div className="flex flex-col min-h-screen">
          <main id="main-content" className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-text-muted/20 bg-cream/50 no-print">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center text-sm text-text-secondary">
                <p className="mb-2">
                  <span className="text-liturgical-gold">✠</span>{' '}
                  Catholic Missal - Daily Mass Readings{' '}
                  <span className="text-liturgical-gold">✠</span>
                </p>
                <p className="text-xs">
                  For private use in personal prayer and devotion. Not for official liturgical use.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
