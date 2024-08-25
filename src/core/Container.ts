
/**
 * This file is part of the Packet.js DI package.
 *
 * (c) Francisco Ruiz <faruiz.github@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  ContainerOptions,
  Context,
  ContextProvider,
  RegisteredServiceOptions,
  ServiceConfigOptions,
  ServiceRegisterCallback,
} from '../@types/container';
import { Middleware } from '.';

class Container {
  private context: Map<string, Context>;
  private properties: any;
  private readonly options: ContainerOptions;
  public middleware: Middleware;
  static container: Container;

  /**
   * Private constructor to be only accessible within the class declaration
   * @private
   * @constructor
   */
  constructor(options: ContainerOptions = {}) {
    this.context = new Map<string, Context>();
    this.middleware = new Middleware(this);
    this.options = {
      freeze: false,
      proxyMiddleware: true,
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
   * Register a new service or function to the context.
   *
   * @param {string} key - Unique key for the new service or function.
   * @param {ServiceRegisterCallback} callback - Callback function with dependency injection logic.
   * @param {ServiceConfigOptions} [options] - Optional configuration for the service or function.
   * @returns {boolean} - Returns a boolean value indicating whether the service or function was
   * successfully added to the context.
   */
  public add(key: string, callback: ServiceRegisterCallback, options?: ServiceConfigOptions): boolean {
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
    return this.options.proxyMiddleware || ctx.options?.cache || ctx.options?.cached;
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
   * Retrieves the resolved instance from the context based on the provided key and options.
   *
   * @template T - The type of the value to retrieve. Defaults to 'any'.
   *
   * @param {string} key - The key used to retrieve the instance from the context.
   * @param {Context} ctx - The context object containing the resolved instance.
   * @param {RegisteredServiceOptions} options - The options used to configure the resolved instance.
   *
   * @throws {Error} If the context with the specified key cannot be resolved.
   *
   * @returns {T} The resolved instance.
   */
  private getResolvedInstance<T = any>(key: string, ctx: Context, options: RegisteredServiceOptions): T {
    // If ctx.key is not found, throw an exception. This forces the user to handle this situation.
    if (!ctx.key) throw new Error(`The context with key "${key}" could not be resolved.`);

    const { singleton = true } = ctx?.options || {};
    const { proxyMiddleware = true } = options || {};
    const hasProxyMiddleware = proxyMiddleware && this.hasProxy(ctx);

    if (singleton) {
      if (!ctx.instance) {
        const { instance, proxy } = this.getInstance(ctx);
        ctx.instance = instance;
        ctx.proxy = proxy;
      }
      return hasProxyMiddleware ? ctx.proxy : ctx.instance;
    }

    const serviceInstance = this.getInstance(ctx);
    return hasProxyMiddleware ? serviceInstance.proxy : serviceInstance.instance;
  }

  /**
   * Retrieves a value from the context based on the specified key.
   *
   * @template T - The type of the value to retrieve. Defaults to 'any'.
   *
   * @param {string} key - The key of the value to retrieve from the context.
   * @param {RegisteredServiceOptions} options - The options for retrieving the value.
   * @param {boolean} options.proxyMiddleware - Determines whether to use proxy middleware. Defaults to 'true'.
   *
   * @returns {T} - The retrieved value from the context.
   *
   * @throws {Error} If the context with the specified key is not found.
   */
  public get<T = any>(key: string, options: RegisteredServiceOptions): T {
    const ctx = this.context.get(key) || {} as Context;
    return this.getResolvedInstance(key, ctx, options);
  }

  /**
   * Returns the factory object for a given key and options.
   *
   * @template T - The type of the value to retrieve. Defaults to 'any'.
   *
   * @param {string} key - The key of the value to retrieve from the context.
   * @param {RegisteredServiceOptions} options - The options for retrieving the value.
   *
   * @return {T} - The retrieved value from the context.
   *
   * @throws {Error} If the factory context with the given key is not found.
   */
  public getFactory<T = any>(key: string, options: RegisteredServiceOptions): T {
    const ctx = this.context.get(key) || { options: {} } as Context;
    const overrideCtx = {
      ...ctx,
      options: {
        ...ctx.options,
        singleton: false,
      },
    };
    return this.getResolvedInstance(key, overrideCtx, options);
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
   * Retrieves all context services based on the provided options.
   *
   * @template T - The type of the value to retrieve. Defaults to 'ContextProvider'.
   *
   * @param {RegisteredServiceOptions} options - The options used for retrieving the context services.
   *
   * @example
   ```js
   const { Service1, Service2 } = container.getAll();
   const instance1 = Service1(); // Make the instance of the Service1.
   const instance2 = Service2(); // Make the instance of the Service2.
   ```
   *
   * @return {T} - The context services object, where the keys are the context
   * keys and the values are functions that retrieve the context values.
   */
  public getAll<T = ContextProvider>(options: RegisteredServiceOptions): T {
    const contextServices: ContextProvider = {};
    this.context.forEach((ctx) => {
      contextServices[ctx.key] = () => this.get(ctx.key, options);
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
