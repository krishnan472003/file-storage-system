import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation, query } from "./_generated/server";
import { roles } from "./schema";
import { Doc } from "./_generated/dataModel";


export async function getUser(
    ctx: QueryCtx | MutationCtx,
    tokenIdentifier:string) {
    // console.log(tokenIdentifier);
    return await ctx.db.query("users").withIndex("by_tokenIdentifer", (q) => q.eq("tokenIdentifier", tokenIdentifier)).first()
}
export const createUser = internalMutation({
    args: { tokenIdentifier: v.string(),name:v.string(),image: v.string() },
    async handler(ctx, args) {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            orgIds: [],
            name: args.name,
            image: args.image,
        })
    }
})

export const updateUser = internalMutation({
    args: { tokenIdentifier: v.string(),name:v.string(),image: v.string() },
    async handler(ctx, args) {
        const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifer",(q)=>
        q.eq("tokenIdentifier",args.tokenIdentifier)
        )
        .first()

        if(!user){
            throw new ConvexError("no user")
        }
        await ctx.db.patch(user._id, {
            name: args.name,
            image: args.image,
        })
    }
})

export const addOrgIdToUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        orgId: v.string(),
        role:roles,
    },
    async handler(ctx, args) {
        console.log(args.tokenIdentifier)
        const user = await getUser(ctx,args.tokenIdentifier)

        if (!user) throw new ConvexError("expected user to be defined")

        await ctx.db.patch(user._id, {
            orgIds: [...user.orgIds, {orgId: args.orgId,role:args.role}]
        })
    }
})

export const updatedRoleInOrg = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        orgId: v.string(),
        role:roles,
    },
    async handler(ctx, args) {
        console.log(args.tokenIdentifier)
        const user = await getUser(ctx,args.tokenIdentifier)

        if (!user) throw new ConvexError("expected user to be defined")

        const org = user.orgIds.find((org)=> org.orgId === args.orgId)

        if(!org){
            throw new ConvexError("no org found")
        }

        org.role = args.role

        await ctx.db.patch(user._id, {
            orgIds :user.orgIds
        })
    }
})

export const getUserProfile = query({
    args:{
        userId : v.id("users")
    },
    async handler(ctx, args) {
        const user = await ctx.db.get(args.userId);

        return {
            name: user?.name,
            image: user?.image,

        }
    },
})



export const getMe = query({
    args:{},
    async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
        
    if(!identity) return null;

        const user = getUser(ctx,identity.tokenIdentifier)
        if(!user) return null
        else return user
        
    },
})