/* eslint-disable */
/**
 * Generated stub — replace by running: npx convex dev --once
 */
import {
  actionGeneric as action,
  internalActionGeneric as internalAction,
  internalMutationGeneric as internalMutation,
  internalQueryGeneric as internalQuery,
  mutationGeneric as mutation,
  queryGeneric as query,
  httpActionGeneric as httpAction,
} from "convex/server";

export {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
  httpAction,
};

import type { DataModel } from "./dataModel";
import type {
  GenericActionCtx,
  GenericMutationCtx,
  GenericQueryCtx,
} from "convex/server";

export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;
export type ActionCtx = GenericActionCtx<DataModel>;
