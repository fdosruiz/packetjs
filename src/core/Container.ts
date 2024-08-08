import {
  Callback,
  Context,
  IContainerOptions,
  IContextObject,
  IServiceOptions,
} from '../types/common.types';
import { Middleware } from '.';

/**
 * Dependency injection container
 * @author Francisco Ruiz
 */
class Container {
  private context: Map<string, Context>;
  private properties: any;
  private readonly options: IContainerOptions;
  public middleware: Middleware;
  static container: Container;

  /**
   * Private constructor to be only accessible within the class declaration
   * @private
   * @constructor
   */
  constructor(options: IContainerOptions = {}) {
    this.context = new Map<string, Context>();
    this.middleware = new Middleware(this);
    this.options = {
      freeze: false,
      middlewareProxy: true,
      ...options,
    };
    this.properties = {};
  }

  /**
   * Gets always the same instance of the container. (Singleton pattern)
   * @return {Container} The container instance.
   */
  static getContainer(): Container {
    if (!Container.container) {
      Container.container = new Container();
    }
    return Container.container;
  }

  /**
   * Add a new service or function to the context.
   *
   * @param {string} key - Unique key for the new service or function.
   * @param {Callback} callback - Callback function with dependency injection logic.
   * @param {IServiceOptions} [options] - Optional configuration for the service or function.
   * @returns {boolean} - Returns a boolean value indicating whether the service or function was
   * successfully added to the context.
   */
  public add(key: string, callback: Callback, options?: IServiceOptions): boolean {
    const ctx = this.context.get(key);
    const { freeze } = ctx?.options || {};
    const { freeze: globalFreeze } = this.options;

    if (freeze || globalFreeze && ctx) return false;

    this.context.set(key, {
      key,
      callback,
      options,
      instance: null,
      proxy: null,
    });

    return true;
  }

  /**
   * Add configuration properties to the container.
   *
   * @param {object} props - The configuration properties to add to the container.
   * @return {object} - The properties object.
   */
  public addProps(props: object): object {
    this.properties = {
      ...this.properties,
      ...props,
    };
    return this.properties;
  }

  /**
   * Checks if each context should have a middleware proxy, depending on the global options
   * or if the context has the "cache" or "cached" option enabled.
   *
   * @param {Context} ctx - The context to check.
   * @returns {boolean | undefined} - Returns true if the context has a proxy, otherwise false.
   */
  private hasProxy(ctx: Context): boolean | undefined {
    return this.options.middlewareProxy || ctx.options?.cache || ctx.options?.cached;
  }

  /**
   * Retrieve the instance and proxy, from the given context. The proxy will be added only if there are
   * middlewares registered.
   *
   * @param {Context} ctx - The context containing the necessary data.
   * @return {Object} - An object containing the retrieved instance and proxy.
   */
  private getInstance(ctx: Context): { instance: any; proxy: any } {
    const instance = ctx.callback({ container: this, props: this.properties });
    return {
      instance,
      proxy: this.hasProxy(ctx) && this.middleware.getProxy({ ...ctx, instance }),
    };
  }

  /**
   * Gets always the same instance for a concrete context
   *
   * @param {string} key - Unique key of the service or function
   * @param {boolean} proxy - Flag indicating if the middleware proxy should be enabled (default is true)
   * @return {any} - The instance of the service or function associated with the given key,
   * or null if no instance is found
   */
  public get<T = any>(key: string, proxy = true): T {
    const ctx = this.context.get(key);

    // If ctx is not found, throw an exception. This forces the user to handle this situation.
    if (!ctx) throw new Error(`The context with key "${key}" could not be resolved.`);

    if (!ctx.instance) {
      const { instance, proxy } = this.getInstance(ctx);
      ctx.instance = instance;
      ctx.proxy = proxy;
    }

    return proxy && this.hasProxy(ctx)
      ? ctx.proxy
      : ctx.instance;
  }

  /**
   * Retrieves a new instance of a service or function based on the provided key.
   *
   * @param {string} key - The unique key of the service or function.
   * @param {boolean} proxy - Flag indicating if the middleware proxy should be enabled (default is true)
   * @returns {any} - A new instance of the service or function, or null if not found.
   */
  public getFactory<T = any>(key: string, proxy = true): T {
    const ctx = this.context.get(key);

    // If ctx is not found, throw an exception. This forces the user to handle this situation.
    if (!ctx) throw new Error(`The context with key "${key}" could not be resolved.`);

    const instanceObj = this.getInstance(ctx);

    return proxy && this.hasProxy(ctx)
      ? instanceObj.proxy
      : instanceObj.instance;
  }

  /**
   * Retrieves the configuration properties object.
   *
   * @returns {object} The properties object.
   */
  public getProps<T = object>(): T {
    return this.properties;
  }

  /**
   * Retrieves all context objects like a getter function.
   *
   * @param {boolean} proxy - A flag indicating whether the middleware proxy should be
   * enabled or not. Default is true.
   *
   * @example
   ```js
   const {
   Service1,
   Service2,
   } = container.getAll();

   // invoque the services
   Service1();
   Service2();
   ```
   * @returns {IContextObject} - An object containing the context objects and their getters.
   */
  public getAll<T = IContextObject>(proxy = true): T {
    const contextServices: IContextObject = {};
    this.context.forEach((ctx) => {
      contextServices[ctx.key] = () => this.get(ctx.key, proxy);
    });
    return contextServices as T;
  }

  /**
   * Purges the context for the given key. This removes the reference to the instance and the proxy,
   * and allows to liberate memory with the garbage collector.
   *
   * @param {string} key - The key to purge the context for.
   * @return {boolean} - True if the purge was successful, false otherwise.
   */
  public purge(key: string): boolean {
    const ctx = this.context.get(key);
    if (ctx) {
      ctx.instance = null;
      ctx.proxy = null;
      return true;
    }
    return false;
  }
}

export default Container;
