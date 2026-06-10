/* eslint-disable */
/**
 * Generated stub — replace by running: npx convex dev --once
 */
import { anyApi } from "convex/server";
import type { FilterApi, FunctionReference } from "convex/server";

export const api: FilterApi<
  typeof anyApi,
  FunctionReference<any, "public">
> = anyApi as any;

export const internal: FilterApi<
  typeof anyApi,
  FunctionReference<any, "internal">
> = anyApi as any;
