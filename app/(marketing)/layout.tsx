import { Inter, Manrope } from "next/font/google";
import "./landing.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-manrope",
});

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`landing-page ${inter.variable} ${manrope.variable}`}
    >
      {children}
    </div>
  );
}
