import { OrganizationSwitcher, SignedIn, UserButton } from "@clerk/nextjs"

export const Header = () => {
    return (

        <div className="border-b py-4 bg-gray-50">
            <div className="container mx-auto justify-between flex">
                <div>File Drive</div>
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