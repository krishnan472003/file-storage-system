'use client';
import { SignOutButton, SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { SignIn, SignInButton, useSession } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  file: z.custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required"),
})


export default function Home() {
  // const session = useSession();
  const { toast } = useToast();
  const [isFileDialogOpen, setIsFilesDialogOpen] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   title: "",
    //   file: undefined
    // },
  })
  const fieldRef = form.register("file")
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return

    console.log(values)
    console.log(values.file)
    try{

      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": values.file[0].type },
        body: values.file[0],
      });
  
      const { storageId } = await result.json();
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
      })
  
      form.reset()
      setIsFilesDialogOpen(false)
      toast({
        variant: "default",
        title: "File uploaded",
        description: "your file is uploaded"
      })
    }
    catch(e){

      toast({
        variant:"destructive",
        title:"File upload failed.",
        description:"please try again"
      })
    }

  }

  const organization = useOrganization();
  const user = useUser();
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const createFile = useMutation(api.files.createFile)
  const file = useQuery(api.files.getFiles, orgId ? { orgId: orgId } : 'skip')

  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items bg-center">
        <h1 className="text-4xl font-bold"> Your files</h1>
        <Dialog open={isFileDialogOpen} onOpenChange={setIsFilesDialogOpen}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload your file</DialogTitle>
              <DialogDescription>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>title</FormLabel>
                          <FormControl>
                            <Input  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="file"
                      render={() => (
                        <FormItem>
                          <FormLabel>File</FormLabel>
                          <FormControl>
                            <Input type="file" {...fieldRef}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit"
                disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting &&(<Loader2 className=" h-4 w-4 animate-spin"/>
                  )}
                
                  Submit</Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>


      {/* <SignedIn>
        <SignOutButton>
        <Button>Sign out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton>
        <Button>Sign In</Button>
        </SignInButton>
      </SignedOut> */}
      {
        file?.map((file) => {
          return (<div key={file._id}>
            {file.name}</div>)
        })
        // JSON.stringify(organization)
      }


    </main>
  );
}
