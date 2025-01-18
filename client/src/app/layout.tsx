import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Toaster } from "sonner";

import App from "./app";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "InvSuite",
  description: "Inventory Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} antialiased`}>
        <App>
          {children}
          <Toaster position="bottom-center" />
        </App>
      </body>
    </html>
  );
}
