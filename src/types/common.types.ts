import { Container } from '../core';

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

  /**
   * Instance of callback function
   */
  proxy?: any;

  /**
   * Options object for service configuration
   */
  options?: IServiceOptions;
}

/**
 * Represents an interface for a context object.
 * @interface
 */
export interface IContextObject {
  [key: string]: () => any;
}

/**
 * Represents the configuration settings for a service.
 * @interface
 */
export interface IContainerOptions {
  /**
   * Indicates if the services in the container should be frozen (unmodifiable).
   * @type {boolean | undefined}
   */
  freeze?: boolean;

  /**
   * Indicates if the services in the container should be proxied with a middleware.
   * @type {boolean | undefined}
   */
  middlewareProxy?: boolean;
}

/**
 * Represents the configuration settings for a service.
 * @interface
 */
export interface IServiceOptions {
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
 * Properties definition
 */
export type Props = {
  container: Container;
  props: object | any;
}

/**
 * Callback definition
 */
export type Callback = (props: Props) => any;
