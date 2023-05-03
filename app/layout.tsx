import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Azure Open AI ",
  description: "This example shows Azure Open AI integration with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`text-white bg-slate-900 ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
