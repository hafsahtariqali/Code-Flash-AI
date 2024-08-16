import { DM_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

// Define metadata directly as a JavaScript object
const metadata = {
  title: "CodeFlash",
  description: "Enhance your coding skills using our active recall flashcards!",
};

// Apply DM Sans font
const dmSans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const publishableKey = NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return (
    <ClerkProvider publishableKey={publishableKey}>
    <html lang="en">
      <body className={clsx(dmSans.className, "antialiased")}>
        <NavBar/>
        {children}
        <Footer/>
      </body>
    </html>
    </ClerkProvider>
  );
}
