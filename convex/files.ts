import { ConvexError, v } from "convex/values"
import { MutationCtx, QueryCtx, internalMutation, mutation, query } from "./_generated/server"
import { getUser } from "./users";
import { fileType } from "./schema";
import { Id } from "./_generated/dataModel";

// authorisation check function
async function hasAccessToOrg(
    ctx: QueryCtx | MutationCtx,
    orgId: string
) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new ConvexError("not signed in");
    }

    const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifer", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier)).first();

    if (!user) return null;


    const hasAccess = user.orgIds.some(item => item.orgId == orgId)
        || user.tokenIdentifier.includes(orgId)
    if (!hasAccess) return null

    return { user };

}

// mutations

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        type: fileType,
        orgId: v.string(),

    },
    async handler(ctx, args) {

        const hasAccess = await hasAccessToOrg(ctx, args.orgId)
        if (!hasAccess) throw new ConvexError("You dont have authorization")

        await ctx.db.insert("files", {
            name: args.name,
            fileId: args.fileId,
            type: args.type,
            orgId: args.orgId,
            userId: hasAccess.user._id,
        })
    },
})

export const getFiles = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
        favourite: v.optional(v.boolean()),
        deletedOnly: v.optional(v.boolean())
    },
    async handler(ctx, args) {

        const hasAccess = await hasAccessToOrg(ctx, args.orgId)
        if (!hasAccess) return [];

        let files = await ctx.db.query("files").withIndex("by_orgId", (q) => q.eq("orgId", args.orgId)).collect();
        const query = args.query as string
        if (query) {
            files = files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()))
        }

        if (args.favourite) {

            const favourites = await ctx.db
                .query("favourites")
                .withIndex("by_userId_orgId_fileId", (q) =>
                    q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId))
                .collect();

            files = files.filter((file) =>
                favourites.some((favourite) => favourite.fileId === file._id)
            )
            // return files;
        }

        if (args.deletedOnly) {

            files = files.filter((file) => file.shouldDelete)
            // return files;
        }
        else{
            files = files.filter((file) => !file.shouldDelete)

        }


        return files;
        // console.log
    }
})


export const deleteAllFiles = internalMutation({
    args: {
        // fileId: v.id("files"),
    },
    async handler(ctx) {
        const files = ctx.db.query("files")
        .withIndex("by_shouldDelete",(q)=>q.eq("shouldDelete",true))
        .collect()

        await Promise.all((await files).map(async (file) =>{
            await ctx.storage.delete(file.fileId)
            return await ctx.db.delete(file._id)
        }))
    },
})


export const deleteFiles = mutation({
    args: {
        fileId: v.id("files"),
    },
    async handler(ctx, args) {

        const access = await hasAccessToFile(ctx, args.fileId)

        // const file = await ctx.db.get(args.fileId);

        if (!access) throw new ConvexError("no access to file")

        const isAdmin = access.user.orgIds.find((org) => org.orgId == access.file.orgId)?.role === "admin"
        console.log(isAdmin + " ===")
        if (!isAdmin) {
            throw new ConvexError("no access to delete")
        }

        await ctx.db.patch(args.fileId,{
            shouldDelete:true
        });
    },
})

export const restoreFiles = mutation({
    args: {
        fileId: v.id("files"),
    },
    async handler(ctx, args) {

        const access = await hasAccessToFile(ctx, args.fileId)

        // const file = await ctx.db.get(args.fileId);

        if (!access) throw new ConvexError("no access to file")

        const isAdmin = access.user.orgIds.find((org) => org.orgId == access.file.orgId)?.role === "admin"
        console.log(isAdmin + " ===")
        if (!isAdmin) {
            throw new ConvexError("no access to delete")
        }

        await ctx.db.patch(args.fileId,{
            shouldDelete:false
        });
    },
})

export const imageURL = query({
    args: {
        fileId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.fileId)
    },
});

export const toggleFavourite = mutation({
    args: {
        fileId: v.id("files"),
    },
    async handler(ctx, args) {
        const access = await hasAccessToFile(ctx, args.fileId)
        if (!access) return new ConvexError("No access to file")
        const favourite = await ctx.db
            .query("favourites")
            .withIndex("by_userId_orgId_fileId", (q) =>
                q.eq("userId", access.user._id)
                    .eq("orgId", access.file.orgId as string)
                    .eq("fileId", access.file._id))
            .first();

        if (!favourite) {
            await ctx.db.insert("favourites", {
                fileId: access.file._id,
                userId: access.user._id,
                orgId: access.file?.orgId as string,
            })
        }
        else {
            await ctx.db.delete(favourite._id)
        }




    },
})

export const getAllFavourites = query({
    args: {
        orgId: v.string(),
    },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx, args.orgId)
        console.log(hasAccess)
        if (!hasAccess) return []

        const favourite = await ctx.db
            .query("favourites")
            .withIndex("by_userId_orgId_fileId", (q) =>
                q.eq("userId", hasAccess.user._id)
                    .eq("orgId", args.orgId))
            .collect();

        return favourite;

    },
})

async function hasAccessToFile(ctx: QueryCtx | MutationCtx, fileId: Id<"files">) {


    const file = await ctx.db.get(fileId);

    if (!file) return null
    let hasAccess = await hasAccessToOrg(ctx, file.orgId ? file.orgId : "")
    if (!hasAccess) return null


    return { file, user: hasAccess.user }
}
