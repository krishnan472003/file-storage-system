"use client"
import { Button } from "@/components/ui/button"
import { SignInButton, SignedOut } from "@clerk/clerk-react"
import { OrganizationSwitcher, SignedIn, UserButton } from "@clerk/nextjs"
import { AppWindow } from "lucide-react"
import Link from "next/link"

export const Header = () => {
    return (

        <div className="relative z-10 border-b py-4 bg-gray-50">
            <div className="container mx-auto justify-between flex">

                <Link href='/'>
                    <div className="flex gap-2 items-center">
                        <AppWindow />
                        File Drive
                    </div>
                </Link>
                    <SignedIn >
                <Button variant="outline">
                    <Link href='/dashboard/files'>
                        {/* <div className="flex gap-2 items-center"> */}
                        File Drive
                        {/* </div> */}
                    </Link>
                </Button>
                <div className=" px-4 justify-between flex">
                        <div>
                            <OrganizationSwitcher />
                        </div>
                        <div>
                            <UserButton />
                        </div>
                </div>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton>
                            <Button>Sign In</Button>
                        </SignInButton>
                    </SignedOut>
            </div>
        </div>
    )
}