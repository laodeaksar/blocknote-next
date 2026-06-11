/* eslint-disable */
/**
 * Stub — run `npx convex dev --once` to generate the real file.
 */
export {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
  httpAction,
} from "convex/server";

import type { DataModel } from "./dataModel";
import type {
  GenericActionCtx,
  GenericMutationCtx,
  GenericQueryCtx,
} from "convex/server";

export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;
export type ActionCtx = GenericActionCtx<DataModel>;
