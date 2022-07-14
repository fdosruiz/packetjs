"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * Dependency injection container
 * @author Francisco Ruiz
 */
var Container = /*#__PURE__*/function () {
  /**
   * Private constructor to be only accessible within the class declaration
   * @private
   */
  function Container() {
    _classCallCheck(this, Container);

    this.context = [];
    this.properties = {};
  }
  /**
   * Gets always the same instance of the container. (Singleton pattern)
   * @return Container
   */


  _createClass(Container, [{
    key: "add",
    value:
    /**
     * Add a new service or function to context
     * @param key Unique key for the new service or function
     * @param callback Callback function with dependency injection logic
     */
    function add(key, callback) {
      this.context.push({
        key: key,
        callback: callback
      });
      return this;
    }
    /**
     * Add an object configuration to container properties
     * @param props Configuration properties object
     * @return Container
     */

  }, {
    key: "addProps",
    value: function addProps(props) {
      this.properties = _objectSpread(_objectSpread({}, this.properties), props);
      return this;
    }
    /**
     * Find a context
     * @param key Unique key of the service or function
     * @private
     * @return Context | undefined
     */

  }, {
    key: "find",
    value: function find(key) {
      return this.context.find(function (ctx) {
        return ctx.key == key;
      });
    }
    /**
     * Gets the instance for a concrete context
     * @param key Unique key of the service or function
     * @return any
     */

  }, {
    key: "get",
    value: function get(key) {
      var ctx = this.find(key);

      if (ctx) {
        if (!ctx.instance) {
          ctx.instance = ctx.callback({
            container: this,
            props: this.properties
          });
        }

        return ctx.instance;
      }

      return null;
    }
  }], [{
    key: "getContainer",
    value: function getContainer() {
      if (!Container.container) {
        Container.container = new Container();
      }

      return Container.container;
    }
  }]);

  return Container;
}();
/**
 * Context definition
 */


var _default = Container; // declare const packet: Container;
// export default packet;

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb250YWluZXIiLCJjb250ZXh0IiwicHJvcGVydGllcyIsImtleSIsImNhbGxiYWNrIiwicHVzaCIsInByb3BzIiwiZmluZCIsImN0eCIsImluc3RhbmNlIiwiY29udGFpbmVyIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvcmUvQ29udGFpbmVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGVwZW5kZW5jeSBpbmplY3Rpb24gY29udGFpbmVyXG4gKiBAYXV0aG9yIEZyYW5jaXNjbyBSdWl6XG4gKi9cbmNsYXNzIENvbnRhaW5lciB7XG4gIHN0YXRpYyBjb250YWluZXI6IENvbnRhaW5lcjtcbiAgcHJpdmF0ZSBjb250ZXh0OiBDb250ZXh0W107XG4gIHByaXZhdGUgcHJvcGVydGllczogb2JqZWN0O1xuXG4gIC8qKlxuICAgKiBQcml2YXRlIGNvbnN0cnVjdG9yIHRvIGJlIG9ubHkgYWNjZXNzaWJsZSB3aXRoaW4gdGhlIGNsYXNzIGRlY2xhcmF0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29udGV4dCA9IFtdO1xuICAgIHRoaXMucHJvcGVydGllcyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYWx3YXlzIHRoZSBzYW1lIGluc3RhbmNlIG9mIHRoZSBjb250YWluZXIuIChTaW5nbGV0b24gcGF0dGVybilcbiAgICogQHJldHVybiBDb250YWluZXJcbiAgICovXG4gIHN0YXRpYyBnZXRDb250YWluZXIoKTogQ29udGFpbmVyIHtcbiAgICBpZiAoIUNvbnRhaW5lci5jb250YWluZXIpIHtcbiAgICAgIENvbnRhaW5lci5jb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XG4gICAgfVxuICAgIHJldHVybiBDb250YWluZXIuY29udGFpbmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBzZXJ2aWNlIG9yIGZ1bmN0aW9uIHRvIGNvbnRleHRcbiAgICogQHBhcmFtIGtleSBVbmlxdWUga2V5IGZvciB0aGUgbmV3IHNlcnZpY2Ugb3IgZnVuY3Rpb25cbiAgICogQHBhcmFtIGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIHdpdGggZGVwZW5kZW5jeSBpbmplY3Rpb24gbG9naWNcbiAgICovXG4gIHB1YmxpYyBhZGQoa2V5OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjayk6IENvbnRhaW5lciB7XG4gICAgdGhpcy5jb250ZXh0LnB1c2goe1xuICAgICAga2V5LFxuICAgICAgY2FsbGJhY2ssXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIG9iamVjdCBjb25maWd1cmF0aW9uIHRvIGNvbnRhaW5lciBwcm9wZXJ0aWVzXG4gICAqIEBwYXJhbSBwcm9wcyBDb25maWd1cmF0aW9uIHByb3BlcnRpZXMgb2JqZWN0XG4gICAqIEByZXR1cm4gQ29udGFpbmVyXG4gICAqL1xuICBwdWJsaWMgYWRkUHJvcHMocHJvcHM6IG9iamVjdCk6IENvbnRhaW5lciB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0ge1xuICAgICAgLi4udGhpcy5wcm9wZXJ0aWVzLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgYSBjb250ZXh0XG4gICAqIEBwYXJhbSBrZXkgVW5pcXVlIGtleSBvZiB0aGUgc2VydmljZSBvciBmdW5jdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIENvbnRleHQgfCB1bmRlZmluZWRcbiAgICovXG4gIHByaXZhdGUgZmluZChrZXk6IHN0cmluZyk6IENvbnRleHQgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQuZmluZCgoY3R4OiBDb250ZXh0KSA9PiBjdHgua2V5ID09IGtleSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaW5zdGFuY2UgZm9yIGEgY29uY3JldGUgY29udGV4dFxuICAgKiBAcGFyYW0ga2V5IFVuaXF1ZSBrZXkgb2YgdGhlIHNlcnZpY2Ugb3IgZnVuY3Rpb25cbiAgICogQHJldHVybiBhbnlcbiAgICovXG4gIHB1YmxpYyBnZXQoa2V5OiBzdHJpbmcpOiBhbnkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuZmluZChrZXkpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGlmICghY3R4Lmluc3RhbmNlKSB7XG4gICAgICAgIGN0eC5pbnN0YW5jZSA9IGN0eC5jYWxsYmFjayh7IGNvbnRhaW5lcjogdGhpcywgcHJvcHM6IHRoaXMucHJvcGVydGllcyB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHguaW5zdGFuY2U7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogQ29udGV4dCBkZWZpbml0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGV4dCB7XG4gIC8qKlxuICAgKiBVbmlxdWUga2V5IG9mIHRoZSBzZXJ2aWNlIG9yIGZ1bmN0aW9uXG4gICAqL1xuICBrZXk6IHN0cmluZztcblxuICAvKipcbiAgICogQ2FsbGJhY2sgZnVuY3Rpb24gd2l0aCBkZXBlbmRlbmN5IGluamVjdGlvbiBsb2dpY1xuICAgKi9cbiAgY2FsbGJhY2s6IENhbGxiYWNrO1xuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBvZiBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgaW5zdGFuY2U/OiBhbnk7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBkZWZpbml0aW9uXG4gKi9cbmV4cG9ydCB0eXBlIFByb3BzID0ge1xuICBjb250YWluZXI6IENvbnRhaW5lcjtcbiAgcHJvcHM6IG9iamVjdCB8IGFueTtcbn1cblxuLyoqXG4gKiBDYWxsYmFjayBkZWZpbml0aW9uXG4gKi9cbmV4cG9ydCB0eXBlIENhbGxiYWNrID0gKHA6IFByb3BzKSA9PiBhbnk7XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRhaW5lcjtcblxuLy8gZGVjbGFyZSBjb25zdCBwYWNrZXQ6IENvbnRhaW5lcjtcbi8vIGV4cG9ydCBkZWZhdWx0IHBhY2tldDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0lBQ01BLFM7RUFLSjtBQUNGO0FBQ0E7QUFDQTtFQUNFLHFCQUFzQjtJQUFBOztJQUNwQixLQUFLQyxPQUFMLEdBQWUsRUFBZjtJQUNBLEtBQUtDLFVBQUwsR0FBa0IsRUFBbEI7RUFDRDtFQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7Ozs7SUFRRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0lBQ0UsYUFBV0MsR0FBWCxFQUF3QkMsUUFBeEIsRUFBdUQ7TUFDckQsS0FBS0gsT0FBTCxDQUFhSSxJQUFiLENBQWtCO1FBQ2hCRixHQUFHLEVBQUhBLEdBRGdCO1FBRWhCQyxRQUFRLEVBQVJBO01BRmdCLENBQWxCO01BSUEsT0FBTyxJQUFQO0lBQ0Q7SUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBOzs7O1dBQ0Usa0JBQWdCRSxLQUFoQixFQUEwQztNQUN4QyxLQUFLSixVQUFMLG1DQUNLLEtBQUtBLFVBRFYsR0FFS0ksS0FGTDtNQUlBLE9BQU8sSUFBUDtJQUNEO0lBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1dBQ0UsY0FBYUgsR0FBYixFQUErQztNQUM3QyxPQUFPLEtBQUtGLE9BQUwsQ0FBYU0sSUFBYixDQUFrQixVQUFDQyxHQUFEO1FBQUEsT0FBa0JBLEdBQUcsQ0FBQ0wsR0FBSixJQUFXQSxHQUE3QjtNQUFBLENBQWxCLENBQVA7SUFDRDtJQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7Ozs7V0FDRSxhQUFXQSxHQUFYLEVBQTZCO01BQzNCLElBQU1LLEdBQUcsR0FBRyxLQUFLRCxJQUFMLENBQVVKLEdBQVYsQ0FBWjs7TUFDQSxJQUFJSyxHQUFKLEVBQVM7UUFDUCxJQUFJLENBQUNBLEdBQUcsQ0FBQ0MsUUFBVCxFQUFtQjtVQUNqQkQsR0FBRyxDQUFDQyxRQUFKLEdBQWVELEdBQUcsQ0FBQ0osUUFBSixDQUFhO1lBQUVNLFNBQVMsRUFBRSxJQUFiO1lBQW1CSixLQUFLLEVBQUUsS0FBS0o7VUFBL0IsQ0FBYixDQUFmO1FBQ0Q7O1FBQ0QsT0FBT00sR0FBRyxDQUFDQyxRQUFYO01BQ0Q7O01BQ0QsT0FBTyxJQUFQO0lBQ0Q7OztXQXpERCx3QkFBaUM7TUFDL0IsSUFBSSxDQUFDVCxTQUFTLENBQUNVLFNBQWYsRUFBMEI7UUFDeEJWLFNBQVMsQ0FBQ1UsU0FBVixHQUFzQixJQUFJVixTQUFKLEVBQXRCO01BQ0Q7O01BQ0QsT0FBT0EsU0FBUyxDQUFDVSxTQUFqQjtJQUNEOzs7OztBQXVESDtBQUNBO0FBQ0E7OztlQStCZVYsUyxFQUVmO0FBQ0EifQ==