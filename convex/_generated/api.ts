/* eslint-disable */
/**
 * Generated API stubs — replace by running: npx convex dev --once
 */
import type { AnyApi, FilterApi, FunctionReference } from "convex/server";

export type Mounts = {
  blocks: {
    list: FunctionReference<"query", "public", { pageId: string }, any>;
    upsert: FunctionReference<"mutation", "public", { pageId: string; content: any }, any>;
    update: FunctionReference<"mutation", "public", { id: string; content: any }, any>;
  };
  pages: {
    list: FunctionReference<"query", "public", Record<string, never>, any[]>;
    get: FunctionReference<"query", "public", { id: string }, any>;
    create: FunctionReference<"mutation", "public", { title?: string; parentDocument?: string }, string>;
    update: FunctionReference<"mutation", "public", { id: string; title?: string; icon?: string; coverImage?: string; isPublished?: boolean }, any>;
    archive: FunctionReference<"mutation", "public", { id: string }, void>;
    restore: FunctionReference<"mutation", "public", { id: string }, void>;
    remove: FunctionReference<"mutation", "public", { id: string }, void>;
    getArchived: FunctionReference<"query", "public", Record<string, never>, any[]>;
  };
};

export declare const api: FilterApi<typeof fullApi, FunctionReference<any, "public">>;
export declare const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">>;

declare const fullApi: AnyApi;
