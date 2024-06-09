import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export const fileType = v.union(v.literal("image"),v.literal("csv"),v.literal("pdf"))
export default defineSchema({
  files: defineTable({
    name: v.string(),
    type: fileType,
    fileId: v.id("_storage"),
    orgId: v.optional(v.string())
  }).index("by_orgId",['orgId']),

  favourites: defineTable({
    fileId: v.id("files"),
    orgId: v.string(),
    userId: v.id("users")
  }).index("by_userId_orgId_fileId",["userId","orgId","fileId"]),

  users: defineTable({
    tokenIdentifier:v.string(),
    orgIds:v.array(v.string())
  }).index('by_tokenIdentifer',['tokenIdentifier'])
});