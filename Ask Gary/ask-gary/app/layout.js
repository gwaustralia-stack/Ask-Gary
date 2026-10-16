import "./globals.css";
import ServiceWorkerRegister from "./sw-register";

export const metadata = {
  title: "Ask Gary",
  description: "Ask Gary — your own AI assistant platform",
  manifest: "/manifest.webmanifest",
  applicationName: "Ask Gary",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ask Gary"
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-180.png"
  }
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
