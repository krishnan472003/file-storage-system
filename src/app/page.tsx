'use client';
import { SignOutButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { SignIn, SignInButton, useSession } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { useMutation, useQueries, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  // const session = useSession();
  const createFile = useMutation(api.files.createFile)
  const file = useQuery(api.files.getFiles)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
        <SignOutButton>
        <Button>Sign out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton>
        <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
       {
        file?.map((file)=>{
          return (<div key={file._id}>
            {file.name}</div>)
        })
        // JSON.stringify(file)
      }
      <Button onClick={()=>{
        createFile({name:"hello world"})
      }}>CLick</Button>
     
    </main>
  );
}
