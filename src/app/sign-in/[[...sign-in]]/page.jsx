import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex items-center justify-center h-screen bg-black bg-hero-gradient sm:py-15 relative overflow-clip">
            <SignIn
            fallbackRedirectUrl="/dashboard"
            />
        </div>
    );
}



 // appearance={{
                //     elements: {
                //         form:"bg-black",
                //         card: "bg-black text-white", // Dark theme for the card
                //         headerTitle: "text-white", // White text for the header title
                //         formFieldInput: "bg-gray-900 text-white", // Dark input field with gray border
                //         formFieldLabel: "text-white", // White text for input labels
                //         footer: "bg-black text-white", // Ensures the footer background is black
                //         footerActionLink: "text-purple-500", // Purple link for sign-up or other actions
                //         socialButtonsBlockButton: "border-2 border-gray-600 text-white", // Gray border for Google button
                //         socialButtons: "border-2 border-gray-300 rounded-md",
                        
                //     },
                // }}