import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response, NextFunction } from 'express';

/**
 * Utility to manage request-specific context using AsyncLocalStorage.
 * This allows us to store and retrieve values that are specific to the current request,
 * such as user information, request IDs, or any other data that needs to be scoped to
 * the lifetime of a request.
 */
const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

/**
 * Middleware to initialize the request context.
 * This middleware should be used at the beginning of the request processing pipeline.
 * It creates a new AsyncLocalStorage context for each request, allowing us to store
 * and retrieve values that are specific to the current request.
 * @param req
 * @param res
 * @param next
 */
export function requestContextMiddleware(req: Request, res: Response, next: NextFunction) {
  asyncLocalStorage.run(new Map(), () => {
    next();
  });
}

/**
 * Set a value in the current request context.
 * This function allows you to store a value associated with a specific key in the
 * current request context. The value will be available throughout the lifetime of the
 * request and can be retrieved later using the `getValue` function.
 * @param key
 * @param value
 */
export function setValue<T = any>(key: string, value: T) {
  const store = asyncLocalStorage.getStore();
  if (store) {
    store.set(key, value);
  }
}

/**
 * Get a value from the current request context.
 * This function retrieves a value associated with a specific key from the current
 * request context. If the key does not exist, it returns `undefined`.
 * This is useful for accessing values that were set earlier in the request lifecycle,
 * such as user information, request IDs, or any other data that needs to be scoped to
 * the lifetime of the request.
 * @param key
 */
export function getValue<T = any>(key: string): T | undefined {
  const store = asyncLocalStorage.getStore();
  return store ? store.get(key) : undefined;
}