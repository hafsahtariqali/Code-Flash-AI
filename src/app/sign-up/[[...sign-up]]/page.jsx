'use client'
import { SignUp} from "@clerk/nextjs";

export default function Page() {
 
    return ( 
        <div className="flex items-center justify-center h-screen bg-black bg-hero-gradient sm:py-15 relative overflow-clip">
            <SignUp
                fallbackRedirectUrl="/dashboard"
            />
        </div>
    );
}
