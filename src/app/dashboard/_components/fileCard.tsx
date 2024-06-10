import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {formatRelative} from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react"
import { ReactNode} from "react"
import { useQuery } from "convex/react"
import Image from "next/image"
import { api } from "../../../../convex/_generated/api"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { FileCardActions } from "./fileActions"



export const FileCard = ({ file, }: {
    file: Doc<"files"> & {isFavourated:boolean}}) => {
    const typeIcons = {
        image: <ImageIcon />,
        pdf: <FileTextIcon />,
        csv: <GanttChartIcon />,
    } as Record<Doc<"files">["type"], ReactNode>;

    // const isFavourated: boolean = favourites.some((favourite) => favourite.fileId == file._id);
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
                    <FileCardActions  isFavourated= {file.isFavourated} file={file} />
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
