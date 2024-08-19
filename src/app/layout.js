import { DM_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Head from 'next/head';



// Define metadata directly as a JavaScript object
const metadata = {
  title: "CodeFlash",
  description: "Enhance your coding skills using our active recall flashcards!",
};

// Apply DM Sans font
const dmSans = DM_Sans({ subsets: ["latin"] });
//const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
    <html lang="en">
    <Head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
        </Head>
      <body className={clsx(dmSans.className, "antialiased")}>
        <NavBar/>
        {children}
        <Footer/>
      </body>
    </html>
    </ClerkProvider>
  );
}
