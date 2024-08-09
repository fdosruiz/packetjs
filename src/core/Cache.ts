import { Context } from '../@types/common';
import Middleware from './Middleware';

/**
 * Caches the results of method calls.
 */
class Cache {
  private storage = new Map<string, any>();
  private context = new Map<string, any>();

  /**
   * Adds the cache middleware to the middleware stack.
   *
   * @param {Context} ctx - The context object.
   * @param {Middleware} middleware - The middleware service.
   * @returns {void}
   */
  public add(ctx: Context, middleware: Middleware): void {
    if (!this.context.has(ctx.key)) {
      middleware.add(ctx.key, (next, context, args) => {
        const key = this.generateCacheKey(ctx.key, context.methodName, args);
        const isCacheable = this.isCacheable(ctx, context.methodName);

        if (isCacheable && this.storage.has(key)) {
          return this.storage.get(key);
        }

        const result = next(args);
        isCacheable && this.storage.set(key, result);
        return result;
      }, {
        priority: -1000,
        name: 'Cache',
      });
      this.context.set(ctx.key, ctx);
    }
  }

  /**
   * Determines whether the given method should be cached.
   *
   * @param {Context} ctx - The context object.
   * @param {string} method - The method to check.
   * @returns {boolean} - Returns true if the method should be cached, otherwise returns false.
   */
  private isCacheable(ctx: Context, method: string): boolean {
    return ctx.options?.methods
      ? this.hasConfigMethod(ctx.options.methods, method, ctx.options.excludeMode)
      : true;
  }

  /**
   * Checks if a given method is present in the configMethods array.
   *
   * @param {string[]} configMethods - The array of config methods.
   * @param {string} method - The method to check.
   * @param {boolean} [excludeMode] - Optional. When set to true, checks if the method is not present in the
   * configMethods array. Default is false.
   * @returns {boolean} - True if the method is found in the configMethods array, false otherwise (or if excludeMode
   * is true and method is found).
   */
  private hasConfigMethod(configMethods: string[], method: string, excludeMode?: boolean): boolean {
    return excludeMode
      ? !configMethods.includes(method)
      : configMethods.includes(method);
  }

  /**
   * Generates a cache key for a given key, method and argument array.
   *
   * @param {string} key - The key for the cache entry.
   * @param {string} method - The method name.
   * @param {any[]} argArray - The argument array.
   * @return {string} The generated cache key.
   */
  private generateCacheKey(key: string, method: string, argArray: any[]): string {
    return `${key}_${method}_${JSON.stringify(argArray)}`.replace(/ /g, '');
  }
}

export default Cache;
