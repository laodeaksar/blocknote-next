import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pages: defineTable({
    title: v.string(),
    icon: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    userId: v.string(),
    isArchived: v.boolean(),
    isPublished: v.boolean(),
    parentDocument: v.optional(v.id("pages")),
    order: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),

  blocks: defineTable({
    pageId: v.id("pages"),
    content: v.any(),
    position: v.number(),
  }).index("by_page", ["pageId"]),
});
