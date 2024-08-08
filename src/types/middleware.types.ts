import { Container } from "../core";

declare type Options = {
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

interface IMiddlewareStack {
  /**
   * Represents if the middleware is global or not.
   *
   * @type {boolean} global
   */
  global: boolean;

  /**
   * The middleware to be added.
   *
   * @type {IMiddleware} middleware
   */
  middleware: IMiddleware;

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
interface IMiddlewareContext {
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

type IMiddleware = (next: (args?: any[]) => any, context: IMiddlewareContext, args: any[]) => any;

export {
  IMiddleware,
  IMiddlewareStack,
  Options,
};
