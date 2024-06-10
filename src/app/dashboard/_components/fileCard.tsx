import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {formatRelative} from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DeleteIcon, Download, FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, Star, StarHalf, TextIcon, Trash2, Undo2Icon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation, useQueries, useQuery } from "convex/react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { api } from "../../../../convex/_generated/api"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { Protect } from "@clerk/clerk-react"


const FileCardActions = ({ file, isFavourated }:
    {
        file: Doc<"files">,
        isFavourated: boolean,
    }) => {
    const { toast } = useToast()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const toggleFavourite = useMutation(api.files.toggleFavourite);
    const deleteFile = useMutation(api.files.deleteFiles)
    const restoreFile = useMutation(api.files.restoreFiles)
    const getFile = useQuery(api.files.imageURL, { fileId: file.fileId }) as string


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

                    <Protect role="org:admin" fallback={<></>} >
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

export const FileCard = ({ file, favourites }: {
    file: Doc<"files">,
    favourites: Doc<"favourites">[]
}) => {
    const typeIcons = {
        image: <ImageIcon />,
        pdf: <FileTextIcon />,
        csv: <GanttChartIcon />,
    } as Record<Doc<"files">["type"], ReactNode>;

    const isFavourated: boolean = favourites.some((favourite) => favourite.fileId == file._id);
    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId
    })
    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2 text-base font-normal">
                    <div className="flex justify-center">{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
                <div className="absolute top-2 right-2">
                    <FileCardActions isFavourated={isFavourated} file={file} />
                </div>
            </CardHeader>
            <CardContent className="h-[200px]">
                {
                    file.type === 'image' && (
                        <FileImage file={file} />
                    )
                }
                {
                    file.type === 'csv' && (
                        <GanttChartIcon className="w-20 h-20" />
                    )
                }
                {
                    file.type === 'pdf' && (
                        <FileTextIcon className="w-20 h-20" />
                    )
                }
            </CardContent>

            <CardFooter className="flex justify-between">
                <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
                <Avatar className="w-6 h-6 text-[6px]">
                    <AvatarImage src={userProfile?.image} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {userProfile?.name}
                </div>
                <div className="text-xs">
                    Uploaded on {formatRelative(new Date(file._creationTime),new Date())}
                </div>

                {/* {userProfile?.image} */}

            </CardFooter>
        </Card>

    )
}

const FileImage = ({ file }: { file: Doc<"files"> }) => {
    const getURL = useQuery(api.files.imageURL, { fileId: file.fileId }) as string
    return (
        <>
            <Image alt={file.name} width={300} height={100} src={getURL} />

        </>
    )
}
