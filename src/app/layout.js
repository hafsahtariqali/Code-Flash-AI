import { DM_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";

// Define metadata directly as a JavaScript object
const metadata = {
  title: "CodeFlash",
  description: "Enhance your coding skills using our active recall flashcards!",
};

// Apply DM Sans font
const dmSans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={clsx(dmSans.className, "antialiased")}>
        {children}
      </body>
    </html>
  );
}
