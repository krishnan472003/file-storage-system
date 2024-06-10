import { Button } from "@/components/ui/button"
import { OrganizationSwitcher, SignedIn, UserButton } from "@clerk/nextjs"
import { AppWindow } from "lucide-react"
import Link from "next/link"

export const Header = () => {
    return (

        <div className="border-b py-4 bg-gray-50">
            <div className="container mx-auto justify-between flex">

                <Link href='/'>
                    <div className="flex gap-2 items-center">
                        <AppWindow />
                        File Drive
                    </div>
                </Link>
                <Button variant="outline">
                    <Link href='/dashboard/files'>
                        {/* <div className="flex gap-2 items-center"> */}
                        File Drive
                        {/* </div> */}
                    </Link>
                </Button>
                <div className=" px-4 justify-between flex">
                    <SignedIn >
                        <div>
                            <OrganizationSwitcher />
                        </div>
                        <div>
                            <UserButton />
                        </div>
                    </SignedIn>
                </div>
            </div>
        </div>
    )
}