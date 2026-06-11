/* eslint-disable */
/**
 * Stub — run `npx convex dev --once` to generate the real file.
 */

export const api: any = new Proxy(
  {},
  { get: (_t, p) => new Proxy({ _name: String(p) }, { get: (_t2, p2) => ({ _name: `${String(p)}.${String(p2)}` }) }) }
);

export const internal: any = new Proxy(
  {},
  { get: (_t, p) => new Proxy({ _name: String(p) }, { get: (_t2, p2) => ({ _name: `${String(p)}.${String(p2)}` }) }) }
);

export const components: {
  betterAuth: any;
  prosemirrorSync: any;
} = {
  betterAuth: api,
  prosemirrorSync: api,
};
