import { Context } from '../@types/common';
import { MiddlewareCallback, MiddlewareStack, MiddlewareOptions } from '../@types/middleware';
import { Container } from '.';
import { Cache } from '.';

class Middleware {
  private globalKey = 'global';
  private middlewareStack = new Map<string, MiddlewareStack[]>();
  private readonly container: Container;
  private readonly cache: Cache;

  constructor(container: Container) {
    this.container = container;
    this.cache = new Cache();
  }

  /**
   * Adds a new middleware to the middlewares stack for a given key.
   *
   * @param {string} key - The key under which the middleware should be added.
   * @param {MiddlewareCallback} middleware - The middleware to be added.
   * @param {MiddlewareOptions} options - The options for the middleware.
   * @returns {void}
   */
  public add(key: string, middleware: MiddlewareCallback, options?: MiddlewareOptions) {
    this.registerMiddleware(key, middleware, options);
    this.container.purge(key);
  }

  /**
   * Add a new global middleware to the middlewares stack.
   *
   * @param {MiddlewareCallback} middleware - The middleware to be added.
   * @param {MiddlewareOptions} options - The options for the middleware.
   * @return {void}
   */
  public addGlobal(middleware: MiddlewareCallback, options?: MiddlewareOptions) {
    this.registerMiddleware(this.globalKey, middleware, options);
  }

  /**
   * Register a new middleware to the middlewares stack for a given key.
   *
   * @param {string} key - The key to identify the middlewares stack.
   * @param {MiddlewareCallback} middleware - The middleware to be added.
   * @param {MiddlewareOptions} options - Optional options for the middleware.
   * @return {void}
   */
  private registerMiddleware(key: string, middleware: MiddlewareCallback, options?: MiddlewareOptions) {
    const stack = this.middlewareStack.get(key) || [];

    // Add middleware to stack array
    stack.push({
      global: key === this.globalKey,
      middleware,
      name: options?.name,
      priority: options?.priority,
    });

    // Sort middlewares by priority
    stack.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Add array to middlewares stack
    this.middlewareStack.set(key, stack);
  }

  /**
   * Adds cache middleware to the given context.
   *
   * @param {Context} ctx - The context object.
   *
   * @return {void}
   */
  private addCacheMiddleware(ctx: Context) {
    if (ctx.options?.cache || ctx.options?.cached) {
      this.cache.add(ctx, this);
    }
  }

  /**
   * Gets a proxy instance from the given context.
   *
   * @param {Context} ctx - The context to which the proxy will be added.
   * @return {Object} - The instance of the context, with the proxy added if any middlewares are present,
   * otherwise the instance as is.
   */
  public getProxy(ctx: Context) {
    this.addCacheMiddleware(ctx);

    const middlewares = [
      ...this.middlewareStack.get(this.globalKey) || [],
      ...this.middlewareStack.get(ctx.key) || [],
    ];

    if (middlewares.length > 0) {
      return this.createProxy(ctx, middlewares);
    }

    return ctx.instance;
  }

  /**
   * Creates a proxy for the given context and middlewares, only if instance is an object, otherwise it returns the
   * original instance.
   *
   * @param {Context} ctx - The context object.
   * @param {MiddlewareStack[]} middlewares - The array of middlewares to be applied to the proxy handler.
   * @returns {ProxyHandler<any>} - The proxy handler.
   */
  private createProxy(ctx: Context, middlewares: MiddlewareStack[]): any {
    return typeof ctx.instance === 'object' || typeof ctx.instance === 'function'
      ? new Proxy(ctx.instance, this.createProxyHandler(ctx, middlewares))
      : ctx.instance;
  }

  /**
   * Creates a proxy handler for the given context. This method implements the Chain of Responsibility pattern.
   *
   * @param {Context} ctx - The context object.
   * @param {MiddlewareStack[]} middlewares - The array of middleware functions.
   * @return {ProxyHandler<any>} - The proxy handler.
   */
  createProxyHandler(ctx: Context, middlewares: MiddlewareStack[]) {
    return {
      get: (target: any, methodName: string, receiver: any) => {
        const targetMethod = target[methodName];
        if (typeof targetMethod !== 'function') {
          return Reflect.get(target, methodName, receiver);
        }

        return (...args: any[]) => {
          let index = -1;

          const handleNextMiddleware = (i: number, newArgs: any[]) => {
            if (i <= index) throw new Error('next() called multiple times');
            index = i;
            const currentMiddleware = middlewares[i];

            if (!currentMiddleware) {
              return Reflect.apply(targetMethod, target, newArgs);
            }

            const next = (newArgsNext: any[] = newArgs) => handleNextMiddleware(i + 1, newArgsNext);
            const context = {
              container: this.container,
              methodName,
              serviceName: ctx.key,
            };

            return currentMiddleware.middleware(next, context, newArgs);
          };

          return handleNextMiddleware(0, args);
        };
      },
    };
  }
}

export default Middleware;
