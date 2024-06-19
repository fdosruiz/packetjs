/**
 * Dependency injection container
 * @author Francisco Ruiz
 */
declare class Container {
    static container: Container;
    private context;
    private properties;
    /**
     * Private constructor to be only accessible within the class declaration
     * @private
     */
    private constructor();
    /**
     * Gets always the same instance of the container. (Singleton pattern)
     * @return Container
     */
    static getContainer(): Container;
    /**
     * Add a new service or function to context
     * @param key Unique key for the new service or function
     * @param callback Callback function with dependency injection logic
     */
    add(key: string, callback: Callback): Container;
    /**
     * Add an object configuration to container properties
     * @param props Configuration properties object
     * @return Container
     */
    addProps(props: object): Container;
    /**
     * Find a context
     * @param key Unique key of the service or function
     * @private
     * @return Context | undefined
     */
    private find;
    /**
     * Gets always the same instance for a concrete context
     * @param key Unique key of the service or function
     * @return any
     */
    get(key: string): any;
    /**
     * Gets always a new instance for a concrete context
     * @param key Unique key of the service or function
     * @return any
     */
    getFactory(key: string): any;
    /**
     * Gets the configuration properties object
     * @return object
     */
    getProps(): object;
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
export declare type Props = {
    container: Container;
    props: object | any;
};
/**
 * Callback definition
 */
export declare type Callback = (p: Props) => any;
export default Container;
