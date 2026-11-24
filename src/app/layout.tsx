import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider, SiteDataProvider } from "@/components/common/theme-provider";
import { ChatbotWidget } from "@/components/common/chatbot-widget";
import { Toaster } from "sonner";
import { getChatbotServerData, getLandingPageData } from "@/server/actions/landing";
import TopLoader from "@/components/common/top-loader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const landingData = await getLandingPageData();
  const favicon = landingData?.systemSettings?.faviconUrl || "/images/fav3.png";
  const siteName =
    landingData?.systemSettings?.siteName ||
    landingData?.navbar?.logo?.brandName ||
    "Clickpoint Innovation";

  return {
    title: `${siteName} | AI-First Digital Partner`,
    description:
      "Clickpoint Innovation builds AI-focused digital products that enhance productivity and profitability for global brands.",
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatbotData, landingData] = await Promise.all([
    getChatbotServerData(),
    getLandingPageData(),
  ]);

  const faviconUrl = landingData?.systemSettings?.faviconUrl || "/images/fav3.png";

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href={faviconUrl} />
        <link rel="shortcut icon" href={faviconUrl} />
        <link rel="apple-touch-icon" href={faviconUrl} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('clickpoint_theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-poppins font-sans antialiased">
        <TopLoader />
        <SiteDataProvider
          navbar={landingData?.navbar}
          footer={landingData?.footer || landingData?.footerData}
          cta={landingData?.ctaBanner}
          chatbot={chatbotData}
          settings={landingData?.systemSettings}
        >
          <ThemeProvider>
            {children}
            <ChatbotWidget initialData={chatbotData} />
            <Toaster position="top-right" richColors closeButton duration={4000} />
          </ThemeProvider>
        </SiteDataProvider>
      </body>
    </html>
  );
}
