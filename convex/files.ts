import { ConvexError, v } from "convex/values"
import {MutationCtx, QueryCtx, mutation, query} from "./_generated/server"
import { getUser } from "./users";


async function hasAccessToOrg(
    ctx:QueryCtx|MutationCtx,
    tokenIdentifier:string,
    orgId:string
){
    const user = await  getUser(ctx,tokenIdentifier);

    if(!user) throw new ConvexError("User  should have been defined")
    
    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)
    return hasAccess;
    
}
export const createFile = mutation({
    args: {
        name : v.string(),
        orgId : v.string(),
    },
    async handler(ctx,args){
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("not signed in");
        }
            const hasAccess = await hasAccessToOrg(ctx,identity.tokenIdentifier,args.orgId)
            if(!hasAccess) throw new ConvexError("You dont have authorization")
        await ctx.db.insert("files",{
            name:args.name,
            orgId:args.orgId,
        })
    },
})

export const getFiles = query({
    args:{
        orgId:v.string(),
    },
    async handler(ctx,args) {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            return [];
        }
        const hasAccess = await hasAccessToOrg(ctx,identity.tokenIdentifier,args.orgId)
        if(!hasAccess) return [];
        else return await ctx.db.query("files").withIndex("by_orgId",(q)=>q.eq("orgId",args.orgId)).collect();
        // console.log
    }
})