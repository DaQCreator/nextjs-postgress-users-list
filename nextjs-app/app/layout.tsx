import { cn } from "@/lib/utils";
import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  metadataBase: new URL("https://twojapka.pl/"),
  title: "Recruitment Task - DaQCreator",
  description:
    "Next.js with clean Postgress database - can be improved by use Prisma, Drizzle, or others ORMs",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, "container bg-zinc-100")}>
        {children}
      </body>
    </html>
  );
}
