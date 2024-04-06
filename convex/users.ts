import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation } from "./_generated/server";


export async function getUser(
    ctx: QueryCtx | MutationCtx,
    tokenIdentifier:string) {
    // console.log(tokenIdentifier);
    return await ctx.db.query("users").withIndex("by_tokenIdentifer", (q) => q.eq("tokenIdentifier", tokenIdentifier)).first()
}
export const createUser = internalMutation({
    args: { tokenIdentifier: v.string() },
    async handler(ctx, args) {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            orgIds: []
        })
    }
})

export const addOrgIdToUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        orgId: v.string()
    },
    async handler(ctx, args) {
        console.log(args.tokenIdentifier)
        const user = await getUser(ctx,args.tokenIdentifier)

        if (!user) throw new ConvexError("expected user to be defined")

        await ctx.db.patch(user._id, {
            orgIds: [...user.orgIds, args.orgId]
        })
    }
})