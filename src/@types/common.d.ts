import { Container } from '../core';

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
export interface ContextProvider {
  [key: string]: () => any;
}

/**
 * Represents the configuration settings for a service.
 * @interface
 */
export interface ContainerOptions {
  /**
   * Indicates if the services in the container should be frozen (unmodifiable).
   * @type {boolean | undefined}
   */
  freeze?: boolean;

  /**
   * Indicates if the services in the container should be proxied with a middleware.
   * @type {boolean | undefined}
   */
  proxyMiddleware?: boolean;
}

/**
 * Represents the configuration settings for a registered service.
 * @interface
 */
export interface ServiceConfigOptions {
  /**
   * @deprecated since version 1.4.0. Will be removed in version 2.0.
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
  methods?: string[] | undefined;

  /**
   * Represents the exclude mode setting for the cache and memoization of methods defined in the `methods` array.
   * @type {boolean}
   */
  excludeMode?: boolean | undefined;

  /**
   * Indicates if the service is frozen (unmodifiable).
   * @type {boolean | undefined}
   */
  freeze?: boolean | undefined;
}

/**
 * Callback props definition registering a new service or function
 */
export type RegisterCallbackProps = {
  container: Container;
  props: object | any;
}

/**
 * Callback function to be executed when a new service or function is registered to the container
 */
export type ServiceRegisterCallback = (props: RegisterCallbackProps) => any;
