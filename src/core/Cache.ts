import { Context } from '../types/common.types';

/**
 * Caches the results of method calls.
 */
class Cache {
  private methods = new Map<string, any>();
  private instances = new Map<string, any>();

  /**
   * Memorizes the methods on the given context instance, creating a cache proxy for each method,
   * only if "config.cached" is active.
   *
   * @param {Context} ctx - The context object.
   * @return {Object} - The original context object with methods memorized.
   */
  public memorizeMethods(ctx: Context): Context {
    if (ctx.options?.cached && !this.instances.has(ctx.key) && typeof ctx.instance === 'object') {
      const methods = this.extractMethods(ctx);

      methods.forEach((method) => {
        ctx.instance[method] = this.createCacheProxy(ctx, method);
      });

      this.instances.set(ctx.key, ctx.instance);
    }

    return ctx;
  }

  /**
   * Extracts methods from the given context. The methods are extracted from the prototype of the instance or
   * the keys of the object instance.
   *
   * @param {Context} ctx - The context object.
   * @returns {string[]} - An array of method names.
   */
  private extractMethods(ctx: Context): string[] {
    const objectMethods = this.getObjectMethods(ctx);
    const functionMethods = this.getFunctionMethods(ctx);
    const configMethods = ctx.options?.methods;
    let methods = [...objectMethods, ...functionMethods].filter(
      method => typeof ctx.instance[method] === 'function',
    );

    if (configMethods) {
      const filterModeCallback = ctx.options?.excludeMode
        ? (method: string) => !configMethods.includes(method)
        : (method: string) => configMethods.includes(method);
      methods = methods.filter(filterModeCallback);
    }

    return methods;
  }

  private getObjectMethods(ctx: Context): string[] {
    return Object.prototype !== ctx.instance.__proto__
      ? Object.getOwnPropertyNames(ctx.instance.__proto__)
      : [];
  }

  private getFunctionMethods(ctx: Context): string[] {
    return Object.keys(ctx.instance);
  }

  /**
   * Creates a cache proxy for a given method.
   *
   * @param {Context} ctx - The context object.
   * @param {string} method - The name of the method to create a cache proxy for.
   * @returns {ProxyHandler<any>} - The cache proxy handler.
   */
  private createCacheProxy(ctx: Context, method: string): ProxyHandler<any> {
    return new Proxy(ctx.instance[method], {
      apply: (target, thisArg, argArray) => {
        const key = this.generateCacheKey(ctx.key, method, argArray);

        if (this.methods.has(key)) {
          return this.methods.get(key);
        }

        const result = target.apply(thisArg, argArray);
        this.methods.set(key, result);

        return result;
      },
    });
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
