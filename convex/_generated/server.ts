/* eslint-disable */
/**
 * Generated server stubs — replace by running: npx convex dev --once
 */
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "convex/server";
export { internalAction, internalMutation, internalQuery };

import { action, mutation, query, httpAction } from "convex/server";
export { action, mutation, query, httpAction };

import { DataModel } from "./dataModel";
import type {
  GenericActionCtx,
  GenericMutationCtx,
  GenericQueryCtx,
} from "convex/server";

export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;
export type ActionCtx = GenericActionCtx<DataModel>;
