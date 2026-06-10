/* eslint-disable */
/**
 * Generated stub — replace by running: npx convex dev --once
 */
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
  httpAction,
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
