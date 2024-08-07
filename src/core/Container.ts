import {
  Callback,
  Context,
  IContextObject,
  IServiceOptions,
} from '../types/common.types';
import { Cache } from '.';

/**
 * Dependency injection container
 * @author Francisco Ruiz
 */
class Container {
  static container: Container;
  private context: Map<string, Context>;
  private properties: object;
  private cache: Cache;

  /**
   * Private constructor to be only accessible within the class declaration
   * @private
   * @constructor
   */
  private constructor() {
    this.context = new Map<string, Context>();
    this.properties = {};
    this.cache = new Cache();
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
   * @returns {Container} - The updated Container object.
   */
  public add(key: string, callback: Callback, options?: IServiceOptions): Container {
    this.context.set(key, {
      key,
      callback,
      options,
    });
    return this;
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
   * Gets always the same instance for a concrete context
   *
   * @param {string} key - Unique key of the service or function
   * @return {any} - The instance of the service or function associated with the given key,
   * or null if no instance is found
   */
  public get(key: string): any {
    const ctx = this.context.get(key);
    if (ctx) {
      if (!ctx.instance) {
        ctx.instance = ctx.callback({ container: this, props: this.properties });
        this.cache.memorizeMethods(ctx);
      }
      return ctx.instance;
    }
    return null;
  }

  /**
   * Retrieves a new instance of a service or function based on the provided key.
   *
   * @param {string} key - The unique key of the service or function.
   * @returns {any} - A new instance of the service or function, or null if not found.
   */
  public getFactory(key: string): any {
    const ctx = this.context.get(key);
    return ctx
      ? ctx.callback({ container: this, props: this.properties })
      : null;
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
   * Retrieves all context objects like a getter function
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
  public getAll(): IContextObject {
    const contextServices: IContextObject = {};
    this.context.forEach((ctx) => {
      contextServices[ctx.key] = () => this.get(ctx.key);
    });
    return contextServices;
  }
}

export default Container;
