import {
  Callback,
  Context,
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
  private properties: object;
  public middleware: Middleware;
  static container: Container;

  /**
   * Private constructor to be only accessible within the class declaration
   * @private
   * @constructor
   */
  constructor() {
    this.context = new Map<string, Context>();
    this.middleware = new Middleware(this);
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

    if (freeze) return false;

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
   * @return {Container} - The modified container.
   */
  public addProps(props: object): Container {
    this.properties = {
      ...this.properties,
      ...props,
    };
    return this;
  }

  /**
   * Retrieve an instance, and add a proxy, from the given context. The proxy will be added only if there are
   * middlewares registered.
   *
   * @param {Context} ctx - The context containing the necessary data.
   * @return {Object} - An object containing the retrieved instance and proxy.
   */
  private getInstance(ctx: Context) {
    const instance = ctx.callback({ container: this, props: this.properties });
    return {
      instance,
      proxy: this.middleware.getProxy({ ...ctx, instance }),
    };
  }

  /**
   * Gets always the same instance for a concrete context
   *
   * @param {string} key - Unique key of the service or function
   * @param {boolean} disableProxy - Flag indicating if proxy should be disabled (default is false)
   * @return {any} - The instance of the service or function associated with the given key,
   * or null if no instance is found
   */
  public get(key: string, disableProxy = false): any {
    const ctx = this.context.get(key);
    if (ctx) {
      if (!ctx.instance) {
        const { instance, proxy } = this.getInstance(ctx);
        ctx.instance = instance;
        ctx.proxy = proxy;
      }
      return disableProxy
        ? ctx.instance
        : ctx.proxy;
    }
    return null;
  }

  /**
   * Retrieves a new instance of a service or function based on the provided key.
   *
   * @param {string} key - The unique key of the service or function.
   * @param {boolean} disableProxy - Flag indicating if proxy should be disabled (default is false)
   * @returns {any} - A new instance of the service or function, or null if not found.
   */
  public getFactory(key: string, disableProxy = false): any {
    const ctx = this.context.get(key);
    if (ctx) {
      const { instance, proxy } = this.getInstance(ctx);
      return disableProxy
        ? instance
        : proxy;
    }
    return null;
  }

  /**
   * Retrieves the configuration properties object.
   *
   * @returns {object} The configuration properties object.
   */
  public getProps(): object {
    return this.properties;
  }

  /**
   * Retrieves all context objects like a getter function.
   *
   * @param {boolean} disableProxy - A flag indicating whether proxy should be disabled or not. Default is false.
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
  public getAll(disableProxy = false): IContextObject {
    const contextServices: IContextObject = {};
    this.context.forEach((ctx) => {
      contextServices[ctx.key] = () => this.get(ctx.key, disableProxy);
    });
    return contextServices;
  }

  /**
   * Purges the context for the given key. This removes the reference to the instance and the proxy,
   * and allows to liberate memory with the garbage collector.
   *
   * @param {string} key - The key to purge the context for.
   * @return {boolean} - True if the purge was successful, false otherwise.
   */
  public purge(key: string) {
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
