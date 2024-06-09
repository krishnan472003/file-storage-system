'use client';
import { SignOutButton, SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { z } from "zod"
import UploadButton from "./uploadButton";
import { FileCard } from "./fileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";




export default function Home() {


  const organization = useOrganization();
  const user = useUser();
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  const file = useQuery(api.files.getFiles, orgId ? { orgId: orgId } : 'skip')
  const isLoading = file === undefined;
  return (
    <main className="container mx-auto pt-12">



      {/* 
      <SignedIn>
        <SignOutButton>
          <Button>Sign out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut> */}

      {isLoading && (
        <div className="flex flex-col gap-4 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-grey-700" />
          <div className="text-2xl">Loading your images...</div>
        </div>
      )}
      {!isLoading && file.length === 0 && (
        <>
          <div className="flex flex-col gap-4 w-full items-center mt-24">
            <Image alt="empty dir" width={200} height={200} src="/empty.svg" />
            <div className="text-2xl">
              You don't have any file uploaded
            </div>
            <UploadButton />
          </div>
        </>
      )}


      {
        !isLoading && file.length > 0 && (
          <>
            <div className="flex justify-between items bg-center mb-10">
              <h1 className="text-4xl font-bold"> Your files</h1>
              <UploadButton />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
            {file?.map((file) => {
              return (
                <>
                    <FileCard key={file._id} file={file} />
                </>
              )
              })
              }
            </div>
          </>
        )
      }
    </main>
  );
}
