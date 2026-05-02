import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "../components/AppLayout";
import Providers from "../components/Providers";

export const metadata: Metadata = {
  title: "Vantedge",
  description: "Vantedge Data Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
