import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc, Id } from "../../convex/_generated/dataModel"
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
import { DeleteIcon, FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, TextIcon, Trash2 } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation, useQueries, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
const FileCardActions = ({ file }: { file: Doc<"files"> }) => {
    const { toast } = useToast()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const deleteFile = useMutation(api.files.deleteFiles)
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
                        setIsConfirmOpen(true);
                    }} className="flex gap-2 text-red-600 items-center cursor-pointer"><Trash2 className="w-4 h-4" />Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export const FileCard = ({ file }: { file: Doc<"files"> }) => {
    const getFile = useQuery(api.files.imageURL,{fileId:file.fileId})
    const typeIcons = {
        image: <ImageIcon />,
        pdf: <FileTextIcon />,
        csv: <GanttChartIcon />,
    } as Record<Doc<"files">["type"], ReactNode>;

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                    <div className="flex justify-center">{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
                <div className="absolute top-2 right-2">
                    <FileCardActions file={file} />
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
                        <GanttChartIcon className="w-20 h-20"/>
                    )
                }
                {
                    file.type === 'pdf' && (
                        <FileTextIcon className="w-20 h-20"/>
                    )
                }
            </CardContent>
            <CardFooter>
                <Button
                    onClick={()=>{
                        window.open(getFile,"_blank")
                    }}
                >Download </Button>
            </CardFooter>
        </Card>

    )
}

const FileImage = ({ file }: { file: Doc<"files"> }) => {
    const getURL = useQuery(api.files.imageURL, { fileId: file.fileId })
    return (
        <>
            <Image alt={file.name} width={300} height={100} src={getURL} />

        </>
    )
}
