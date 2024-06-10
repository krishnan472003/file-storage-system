
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Download, MoreVertical, Star, StarHalf, Trash2, Undo2Icon } from "lucide-react"
import {  useState } from "react"
import { useMutation, useQueries, useQuery } from "convex/react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { api } from "../../../../convex/_generated/api"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { Protect } from "@clerk/clerk-react"
import { roles } from "../../../../convex/schema"


export const FileCardActions = ({ file,isFavourated }:
    {
        file: Doc<"files"> & {isFavourated:boolean},
        isFavourated : boolean
    }) => {
    const { toast } = useToast()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const toggleFavourite = useMutation(api.files.toggleFavourite);
    const deleteFile = useMutation(api.files.deleteFiles)
    const restoreFile = useMutation(api.files.restoreFiles)
    const getFile = useQuery(api.files.imageURL, { fileId: file.fileId }) as string
        const me = useQuery(api.users.getMe)

    return (

        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            await deleteFile({ fileId: file._id })
                            toast({
                                variant: "destructive",
                                title: "File Delete.",
                                description: "Your file has been deleted"
                            })
                        }}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>

                    <DropdownMenuItem onClick={() => {
                        toggleFavourite({ fileId: file._id })
                    }} className="flex gap-2 items-center cursor-pointer">

                        {isFavourated ?
                            (
                                <>
                                    <StarHalf className="w-4 h-4" />
                                    remove favourite
                                </>) : (
                                <>
                                    <Star className="w-4 h-4" />
                                    Favourite
                                </>
                            )
                        }
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => {
                        window.open(getFile, "_blank")
                    }} className="flex gap-2 items-center cursor-pointer">
                        <Download className="w-4 h-4"/> Download
                    </DropdownMenuItem>

                    <Protect 
                    condition={(check)=>{
                        return check({
                            role: "org:admin"
                        }) || file.userId === me?._id
                        
                    }}
                    fallback={<></>} >

                        <DropdownMenuSeparator />
                        {!file.shouldDelete ? (
                            <DropdownMenuItem onClick={() => {
                                setIsConfirmOpen(true);
                            }} className="flex gap-2 text-red-600 items-center cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => {
                                restoreFile({ fileId: file._id })
                            }} className="flex gap-2 items-center cursor-pointer">
                                <Undo2Icon className="w-4 h-4" />
                                Restore
                            </DropdownMenuItem>
                        )
                        }
                    </Protect>

                   


                </DropdownMenuContent>
            </DropdownMenu >
        </>
    )
}