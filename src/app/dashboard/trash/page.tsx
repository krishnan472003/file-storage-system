"use client"

import { FilesBrowser } from "../_components/fileBrowser"

export default function Trash(){
    return(
        <FilesBrowser title="Deleted Items" isDeleted/>
    )
}