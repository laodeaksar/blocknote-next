/* eslint-disable */
/**
 * Stub — run `npx convex dev --once` to generate the real file.
 */
import {
  queryGeneric as query,
  mutationGeneric as mutation,
  actionGeneric as action,
  internalQueryGeneric as internalQuery,
  internalMutationGeneric as internalMutation,
  internalActionGeneric as internalAction,
  httpActionGeneric as httpAction,
} from "convex/server";

export { query, mutation, action, internalQuery, internalMutation, internalAction, httpAction };

import type { DataModel } from "./dataModel";
import type {
  GenericActionCtx,
  GenericMutationCtx,
  GenericQueryCtx,
} from "convex/server";

export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;
export type ActionCtx = GenericActionCtx<DataModel>;
