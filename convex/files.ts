import { ConvexError, v } from "convex/values"
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server"
import { getUser } from "./users";
import { fileType } from "./schema";
import { Id } from "./_generated/dataModel";

// authorisation check function
async function hasAccessToOrg(
    ctx: QueryCtx | MutationCtx,
    tokenIdentifier: string,
    orgId: string
) {
    const user = await getUser(ctx, tokenIdentifier);

    if (!user) throw new ConvexError("User  should have been defined")

    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)
    return hasAccess;

}

// mutations

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        type : fileType,
        orgId: v.string(),
    },
    async handler(ctx, args) {

        console.log(args.type)
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("not signed in");
        }
        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)
        if (!hasAccess) throw new ConvexError("You dont have authorization")
        await ctx.db.insert("files", {
            name: args.name,
            fileId: args.fileId,
            type :args.type,
            orgId: args.orgId,
        })
    },
})

export const getFiles = query({
    args: {
        orgId: v.string(),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }
        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)
        if (!hasAccess) return [];
        else return await ctx.db.query("files").withIndex("by_orgId", (q) => q.eq("orgId", args.orgId)).collect();
        // console.log
    }
})

export const deleteFiles = mutation({
    args: {
        fileId: v.id("files"),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("not signed in");
        }
        
        const file = await ctx.db.get(args.fileId);
        
        if(!file) throw new ConvexError("File Does not exist")

        const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, file.orgId?file.orgId:"")
        if (!hasAccess) throw new ConvexError("You dont have authorization to delete")
            
        await ctx.db.delete(args.fileId);
    },
})


export const imageURL =query({
    args: {
        fileId:v.id("_storage"),
    },
    handler: async (ctx,args) => {
      return await ctx.storage.getUrl(args.fileId)
    },
  });