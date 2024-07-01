import { Container } from "../core";

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
   * Configuration object for service
   */
  config?: IServiceConfig;
}

/**
 * Properties definition
 */
export type Props = {
  container: Container;
  props: object | any;
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
export interface IServiceConfig {
  cached: boolean;
  methods?: string[] | undefined;
}

/**
 * Callback definition
 */
export type Callback = (p: Props) => any;
