'use client';
import Link from "next/link";
import "../../globals.css";
import { Button } from "@/components/ui/button";
import { FileIcon, Star, Loader2, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function  SideNav() {
    const pathname = usePathname();

    return (
        <div>
        <Link href="/dashboard/files">
        <Button variant={"link"}  className={clsx("flex gap-2",{
          "text-blue-500":pathname.includes("/dashboard/files")
        })}>
          <FileIcon/> All files
        </Button>
        </Link>

        <Link href="/dashboard/favourites">
        <Button variant={"link"} className={clsx("flex gap-2",{
          "text-blue-500":pathname.includes("/dashboard/favourites")
        })}>
          <Star/> Favourite
        </Button>
        </Link>

        <Link href="/dashboard/trash">
        <Button variant={"link"} className={clsx("flex gap-2",{
          "text-blue-500":pathname.includes("/dashboard/favourites")
        })}>
          <Trash2/> Trash
        </Button>
        </Link>
        
      </div>
    )
}