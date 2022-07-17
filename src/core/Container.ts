/**
 * Dependency injection container
 * @author Francisco Ruiz
 */
class Container {
  static container: Container;
  private context: Context[];
  private properties: object;

  /**
   * Private constructor to be only accessible within the class declaration
   * @private
   */
  private constructor() {
    this.context = [];
    this.properties = {};
  }

  /**
   * Gets always the same instance of the container. (Singleton pattern)
   * @return Container
   */
  static getContainer(): Container {
    if (!Container.container) {
      Container.container = new Container();
    }
    return Container.container;
  }

  /**
   * Add a new service or function to context
   * @param key Unique key for the new service or function
   * @param callback Callback function with dependency injection logic
   */
  public add(key: string, callback: Callback): Container {
    this.context.push({
      key,
      callback,
    });
    return this;
  }

  /**
   * Add an object configuration to container properties
   * @param props Configuration properties object
   * @return Container
   */
  public addProps(props: object): Container {
    this.properties = {
      ...this.properties,
      ...props,
    }
    return this;
  }

  /**
   * Find a context
   * @param key Unique key of the service or function
   * @private
   * @return Context | undefined
   */
  private find(key: string): Context | undefined {
    return this.context.find((ctx: Context) => ctx.key == key);
  }

  /**
   * Gets the instance for a concrete context
   * @param key Unique key of the service or function
   * @return any
   */
  public get(key: string): any {
    const ctx = this.find(key);
    if (ctx) {
      if (!ctx.instance) {
        ctx.instance = ctx.callback({ container: this, props: this.properties });
      }
      return ctx.instance;
    }
    return null;
  }

  /**
   * Gets the configuration properties object
   * @return object
   */
  public getProps(): object {
    return this.properties;
  }
}

/**
 * Context definition
 */
export interface Context {
  /**
   * Unique key of the service or function
   */
  key: string;

  /**
   * Callback function with dependency injection logic
   */
  callback: Callback;

  /**
   * Instance of callback function
   */
  instance?: any;
}

/**
 * Properties definition
 */
export type Props = {
  container: Container;
  props: object | any;
}

/**
 * Callback definition
 */
export type Callback = (p: Props) => any;

export default Container;
