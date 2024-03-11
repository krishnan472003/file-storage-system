'use client';
import { SignOutButton, SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { SignIn, SignInButton, useSession } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  // const session = useSession();
  const organization = useOrganization();
  const user = useUser();

  let orgId: string| undefined = undefined;
  if(organization.isLoaded && user.isLoaded){
    orgId = organization.organization?.id ?? user.user?.id
  }
  
  const createFile = useMutation(api.files.createFile)
  const file = useQuery(api.files.getFiles,orgId ?{orgId:orgId}:'skip')

  console.log(file)
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
        // JSON.stringify(organization)
      }
      <Button onClick={()=>{
        if(orgId)
        createFile({name:"hello world",orgId})
      }}>CLick</Button>
     
    </main>
  );
}
