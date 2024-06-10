"use client"
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { Grid3X3, GridIcon, Loader2, Table2 } from "lucide-react";
import { useState } from "react";
import UploadButton from "./uploadButton";
import { SearchBar } from "./searchBar";
import { FileCard } from "./fileCard";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { api } from "../../../../convex/_generated/api";
import { DataTable, } from "./dataTable";
import { columns } from "./columns";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


function Placeholder() {
  return (
    <>
      <div className="flex flex-col gap-4 w-full items-center mt-24">
        <Image alt="empty dir" width={200} height={200} src="/empty.svg" />
        <div className="text-2xl">
          You don't have any file uploaded
        </div>
        <UploadButton />
      </div>
    </>
  )
}


export const FilesBrowser = ({ title, favouriteOnly, isDeleted }: { title: string, favouriteOnly?: boolean, isDeleted?: boolean }) => {

  const [query, setQuery] = useState("")
  const organization = useOrganization();

  const user = useUser();
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  const favouriteCards = useQuery(api.files.getAllFavourites, orgId ? { orgId } : "skip");
  console.log(favouriteCards)
  const files = useQuery(api.files.getFiles,
    orgId ?
      {
        orgId: orgId,
        query,
        favourite: favouriteOnly,
        deletedOnly: isDeleted,
      } : 'skip')


  const modifiedFiles = files?.map((file) => ({
    ...file,
    isFavourated: (favouriteCards ?? []).some(
      (favourite) => favourite.fileId === file._id
    )
  })) ?? []

  const isLoading = files === undefined;
  return (
    <>

      {isLoading && (
        <div className="flex flex-col gap-4 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-grey-700" />
          <div className="text-2xl">Loading your images...</div>
        </div>
      )}
      {!isLoading && !query && files.length === 0 && <Placeholder />}


      {

        !isLoading && files.length > 0 && (
          <>
            <div className="flex justify-between items bg-center mb-10">
              <h1 className="text-4xl font-bold"> {title}</h1>
              <SearchBar query={query} setQuery={setQuery} />
              <UploadButton />
            </div>
            <Tabs defaultValue="grid">
              <TabsList className="mb-4">
                <TabsTrigger value="grid" className="flex gap-2 items-center"><GridIcon />Grid</TabsTrigger>
                <TabsTrigger value="table" className="flex gap-2 items-center"><Table2 />Table</TabsTrigger>
              </TabsList>
              
              <TabsContent value="grid">
                <>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {modifiedFiles.map((file) => {
                      return (
                        <>
                          <FileCard key={file._id} file={file} />
                        </>
                      )
                    })
                    }
                  </div>
                </>
              </TabsContent>

              <TabsContent value="table">

                <DataTable columns={columns} data={modifiedFiles ?? []} />

              </TabsContent>
            </Tabs>



          </>

        )
      }

    </>
  );
}
