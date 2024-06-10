"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { formatRelative } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { FileCardActions } from "./fileActions"



function UserCell({ userId }: { userId: Id<"users"> }) {
    const userProfile = useQuery(api.users.getUserProfile, {
        userId,
    })
    return (
        <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
            <Avatar className="w-6 h-6 text-[6px]">
                <AvatarImage src={userProfile?.image} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {userProfile?.name}
        </div>
    )
}

export const columns: ColumnDef<Doc<"files"> & {isFavourated:boolean}>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        header: "Uploaded on",
        cell: ({ row }) => {
            return (<>{formatRelative(new Date(row.original._creationTime), new Date())}</>)
        },
    },
    {
        header: "User",
        cell: ({ row }) => {
            return (<UserCell userId={row.original.userId} />)
        },
    },
    {
        header: "Actions",
        cell: ({ row }) => {
            return (<FileCardActions isFavourated={row.original.isFavourated} file ={row.original}/>)
        },
    },
]
