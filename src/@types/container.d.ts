import { Container } from "../core";

/**
 * Represents the configuration settings for a service.
 * @interface
 */
interface ContainerOptions {
  /**
   * Indicates if the services in the container should be frozen (unmodifiable).
   * @type {boolean}
   */
  freeze?: boolean;

  /**
   * Indicates if the services in the container should be proxied with a middleware.
   * @type {boolean}
   */
  proxyMiddleware?: boolean;
}

/**
 * Container Context definition
 */
export interface Context {
  /**
   * Unique key of the service or function
   */
  key: string;

  /**
   * Callback function with dependency injection logic
   */
  callback: ServiceRegisterCallback;

  /**
   * Instance of callback function
   */
  instance?: any;

  /**
   * Instance of callback function
   */
  proxy?: any;

  /**
   * Options object for service configuration
   */
  options?: ServiceConfigOptions;
}

/**
 * Represents an interface for retrieving a collection of all context objects for
 * the getAll() method.
 * @interface
 */
interface ContextProvider {
  [key: string]: () => any;
}

/**
 * Represents the configuration settings for a registered service.
 * @interface
 */
interface RegisteredServiceOptions {
  /**
   * Indicates if the service retrieved from the container should be proxied with
   * a middleware.
   * @type {boolean}
   */
  proxyMiddleware?: boolean;
}

/**
 * Represents the configuration settings for a registered service.
 * @interface
 */
interface ServiceConfigOptions {
  /**
   * @deprecated since version 2.0.0. Will be removed in version 3.0.0.
   * Use {@link cache} instead.
   */
  cached?: boolean;

  /**
   * This variable represents the state of the cache.
   *
   * @type {boolean}
   */
  cache?: boolean;

  /**
   * Represents a collection of methods for the cache and memoization.
   * @type {string[]}
   */
  methods?: string[];

  /**
   * Represents the exclude mode setting for the cache and memoization of methods defined in the `methods` array.
   * @type {boolean}
   */
  excludeMode?: boolean;

  /**
   * Indicates if the service is frozen (unmodifiable).
   * @type {boolean}
   */
  freeze?: boolean;

  /**
   * Enable the singleton pattern for the service.
   * @type {boolean}
   */
  singleton?: boolean;
}

/**
 * Callback props definition registering a new service or function
 */
type RegisterCallbackProps = {
  container: Container;
  props: object | any;
}

/**
 * Callback function to be executed when a new service or function is registered to the container
 */
type ServiceRegisterCallback = (props: RegisterCallbackProps) => any;

export {
  ContainerOptions,
  ContextProvider,
  RegisteredServiceOptions,
  ServiceConfigOptions,
  ServiceRegisterCallback,
};
