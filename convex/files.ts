import { ConvexError, v } from "convex/values"
import {mutation, query} from "./_generated/server"

export const createFile = mutation({
    args: {
        name : v.string(),
    },
    async handler(ctx,args){
        const identity = ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("not signed in");
        }
        else  {
        await ctx.db.insert("files",{
            name:args.name,
        })}
    },
})

export const getFiles = query({
    args:{},
    async handler(ctx,args) {
        return await ctx.db.query("files").collect();
        // console.log
    }
})