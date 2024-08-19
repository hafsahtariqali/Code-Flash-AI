import { DM_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

// Define metadata directly as a JavaScript object
export const metadata = {
  title: "Code Flash",
  description: "Enhance your coding skills using our active recall flashcards!",
};

// Apply DM Sans font
const dmSans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className={clsx(dmSans.className, "antialiased")}>
          <NavBar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
