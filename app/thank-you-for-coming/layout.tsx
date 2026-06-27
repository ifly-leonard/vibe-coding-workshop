import { Caveat } from "next/font/google";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-handwriting",
  display: "swap",
});

export default function ThankYouForComingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={caveat.variable}>{children}</div>;
}
