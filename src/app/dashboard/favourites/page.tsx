"use client"
import { clients } from "@clerk/clerk-sdk-node";
import { FilesBrowser } from "../_components/fileBrowser";
import { useQuery } from "convex/react";

export default function Favourites(){
    return(
        <div>
        <FilesBrowser title="Your Favourites" favouriteOnly ={true}/>
        </div>
    )
}