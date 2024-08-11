import { Container } from "../core";

/**
 * Represents the options for configuring middleware.
 *
 * @interface
 */
interface MiddlewareOptions {
  /**
   * Represents the name of the middleware.
   *
   * @type {string}
   */
  name?: string;

  /**
   * Represents the priority of the middleware.
   *
   * @type {number}
   */
  priority?: number;
}

/**
 * Represents a middleware stack that can be used to manage and execute middleware.
 */
interface MiddlewareStack {
  /**
   * Represents if the middleware is global or not.
   *
   * @type {boolean} global
   */
  global: boolean;

  /**
   * The middleware to be added.
   *
   * @type {MiddlewareCallback} middleware
   */
  middleware: MiddlewareCallback;

  /**
   * The name of the middleware.
   *
   * @type {string} name
   */
  name?: string;

  /**
   * The priority of the middleware.
   *
   * @type {number} priority
   */
  priority?: number;
}

/**
 * Properties definition
 */
interface ContextMiddleware {
  /**
   * The container.
   *
   * @type {Container} container
   */
  container: Container;

  /**
   * Represents the name of a method.
   *
   * @type {string} methodName
   */
  methodName: string;

  /**
   * Represents the name of the service.
   *
   * @type {string} serviceName
   */
  serviceName: string;
}

/**
 * Represents the middleware callback function signature.
 *
 * @callback MiddlewareCallback
 * @param {Function} next - The next middleware function to be called.
 * @param {ContextMiddleware} context - The context object containing middleware data.
 * @param {Array} args - The arguments passed to the middleware.
 * @returns {*} - The result of the middleware operation.
 */
type MiddlewareCallback = (next: (args?: any[]) => any, context: ContextMiddleware, args: any[]) => any;

export {
  MiddlewareCallback,
  MiddlewareStack,
  MiddlewareOptions,
};
