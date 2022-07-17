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
    /**
     * Gets the configuration properties object
     * @return object
     */

  }, {
    key: "getProps",
    value: function getProps() {
      return this.properties;
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


var _default = Container;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb250YWluZXIiLCJjb250ZXh0IiwicHJvcGVydGllcyIsImtleSIsImNhbGxiYWNrIiwicHVzaCIsInByb3BzIiwiZmluZCIsImN0eCIsImluc3RhbmNlIiwiY29udGFpbmVyIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvcmUvQ29udGFpbmVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGVwZW5kZW5jeSBpbmplY3Rpb24gY29udGFpbmVyXG4gKiBAYXV0aG9yIEZyYW5jaXNjbyBSdWl6XG4gKi9cbmNsYXNzIENvbnRhaW5lciB7XG4gIHN0YXRpYyBjb250YWluZXI6IENvbnRhaW5lcjtcbiAgcHJpdmF0ZSBjb250ZXh0OiBDb250ZXh0W107XG4gIHByaXZhdGUgcHJvcGVydGllczogb2JqZWN0O1xuXG4gIC8qKlxuICAgKiBQcml2YXRlIGNvbnN0cnVjdG9yIHRvIGJlIG9ubHkgYWNjZXNzaWJsZSB3aXRoaW4gdGhlIGNsYXNzIGRlY2xhcmF0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29udGV4dCA9IFtdO1xuICAgIHRoaXMucHJvcGVydGllcyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYWx3YXlzIHRoZSBzYW1lIGluc3RhbmNlIG9mIHRoZSBjb250YWluZXIuIChTaW5nbGV0b24gcGF0dGVybilcbiAgICogQHJldHVybiBDb250YWluZXJcbiAgICovXG4gIHN0YXRpYyBnZXRDb250YWluZXIoKTogQ29udGFpbmVyIHtcbiAgICBpZiAoIUNvbnRhaW5lci5jb250YWluZXIpIHtcbiAgICAgIENvbnRhaW5lci5jb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XG4gICAgfVxuICAgIHJldHVybiBDb250YWluZXIuY29udGFpbmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBzZXJ2aWNlIG9yIGZ1bmN0aW9uIHRvIGNvbnRleHRcbiAgICogQHBhcmFtIGtleSBVbmlxdWUga2V5IGZvciB0aGUgbmV3IHNlcnZpY2Ugb3IgZnVuY3Rpb25cbiAgICogQHBhcmFtIGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIHdpdGggZGVwZW5kZW5jeSBpbmplY3Rpb24gbG9naWNcbiAgICovXG4gIHB1YmxpYyBhZGQoa2V5OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjayk6IENvbnRhaW5lciB7XG4gICAgdGhpcy5jb250ZXh0LnB1c2goe1xuICAgICAga2V5LFxuICAgICAgY2FsbGJhY2ssXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIG9iamVjdCBjb25maWd1cmF0aW9uIHRvIGNvbnRhaW5lciBwcm9wZXJ0aWVzXG4gICAqIEBwYXJhbSBwcm9wcyBDb25maWd1cmF0aW9uIHByb3BlcnRpZXMgb2JqZWN0XG4gICAqIEByZXR1cm4gQ29udGFpbmVyXG4gICAqL1xuICBwdWJsaWMgYWRkUHJvcHMocHJvcHM6IG9iamVjdCk6IENvbnRhaW5lciB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0ge1xuICAgICAgLi4udGhpcy5wcm9wZXJ0aWVzLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgYSBjb250ZXh0XG4gICAqIEBwYXJhbSBrZXkgVW5pcXVlIGtleSBvZiB0aGUgc2VydmljZSBvciBmdW5jdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIENvbnRleHQgfCB1bmRlZmluZWRcbiAgICovXG4gIHByaXZhdGUgZmluZChrZXk6IHN0cmluZyk6IENvbnRleHQgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHQuZmluZCgoY3R4OiBDb250ZXh0KSA9PiBjdHgua2V5ID09IGtleSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaW5zdGFuY2UgZm9yIGEgY29uY3JldGUgY29udGV4dFxuICAgKiBAcGFyYW0ga2V5IFVuaXF1ZSBrZXkgb2YgdGhlIHNlcnZpY2Ugb3IgZnVuY3Rpb25cbiAgICogQHJldHVybiBhbnlcbiAgICovXG4gIHB1YmxpYyBnZXQoa2V5OiBzdHJpbmcpOiBhbnkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuZmluZChrZXkpO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIGlmICghY3R4Lmluc3RhbmNlKSB7XG4gICAgICAgIGN0eC5pbnN0YW5jZSA9IGN0eC5jYWxsYmFjayh7IGNvbnRhaW5lcjogdGhpcywgcHJvcHM6IHRoaXMucHJvcGVydGllcyB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdHguaW5zdGFuY2U7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBvYmplY3RcbiAgICogQHJldHVybiBvYmplY3RcbiAgICovXG4gIHB1YmxpYyBnZXRQcm9wcygpOiBvYmplY3Qge1xuICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXM7XG4gIH1cbn1cblxuLyoqXG4gKiBDb250ZXh0IGRlZmluaXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb250ZXh0IHtcbiAgLyoqXG4gICAqIFVuaXF1ZSBrZXkgb2YgdGhlIHNlcnZpY2Ugb3IgZnVuY3Rpb25cbiAgICovXG4gIGtleTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmdW5jdGlvbiB3aXRoIGRlcGVuZGVuY3kgaW5qZWN0aW9uIGxvZ2ljXG4gICAqL1xuICBjYWxsYmFjazogQ2FsbGJhY2s7XG5cbiAgLyoqXG4gICAqIEluc3RhbmNlIG9mIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICBpbnN0YW5jZT86IGFueTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGRlZmluaXRpb25cbiAqL1xuZXhwb3J0IHR5cGUgUHJvcHMgPSB7XG4gIGNvbnRhaW5lcjogQ29udGFpbmVyO1xuICBwcm9wczogb2JqZWN0IHwgYW55O1xufVxuXG4vKipcbiAqIENhbGxiYWNrIGRlZmluaXRpb25cbiAqL1xuZXhwb3J0IHR5cGUgQ2FsbGJhY2sgPSAocDogUHJvcHMpID0+IGFueTtcblxuZXhwb3J0IGRlZmF1bHQgQ29udGFpbmVyO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7SUFDTUEsUztFQUtKO0FBQ0Y7QUFDQTtBQUNBO0VBQ0UscUJBQXNCO0lBQUE7O0lBQ3BCLEtBQUtDLE9BQUwsR0FBZSxFQUFmO0lBQ0EsS0FBS0MsVUFBTCxHQUFrQixFQUFsQjtFQUNEO0VBRUQ7QUFDRjtBQUNBO0FBQ0E7Ozs7OztJQVFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7SUFDRSxhQUFXQyxHQUFYLEVBQXdCQyxRQUF4QixFQUF1RDtNQUNyRCxLQUFLSCxPQUFMLENBQWFJLElBQWIsQ0FBa0I7UUFDaEJGLEdBQUcsRUFBSEEsR0FEZ0I7UUFFaEJDLFFBQVEsRUFBUkE7TUFGZ0IsQ0FBbEI7TUFJQSxPQUFPLElBQVA7SUFDRDtJQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7Ozs7V0FDRSxrQkFBZ0JFLEtBQWhCLEVBQTBDO01BQ3hDLEtBQUtKLFVBQUwsbUNBQ0ssS0FBS0EsVUFEVixHQUVLSSxLQUZMO01BSUEsT0FBTyxJQUFQO0lBQ0Q7SUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7V0FDRSxjQUFhSCxHQUFiLEVBQStDO01BQzdDLE9BQU8sS0FBS0YsT0FBTCxDQUFhTSxJQUFiLENBQWtCLFVBQUNDLEdBQUQ7UUFBQSxPQUFrQkEsR0FBRyxDQUFDTCxHQUFKLElBQVdBLEdBQTdCO01BQUEsQ0FBbEIsQ0FBUDtJQUNEO0lBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7OztXQUNFLGFBQVdBLEdBQVgsRUFBNkI7TUFDM0IsSUFBTUssR0FBRyxHQUFHLEtBQUtELElBQUwsQ0FBVUosR0FBVixDQUFaOztNQUNBLElBQUlLLEdBQUosRUFBUztRQUNQLElBQUksQ0FBQ0EsR0FBRyxDQUFDQyxRQUFULEVBQW1CO1VBQ2pCRCxHQUFHLENBQUNDLFFBQUosR0FBZUQsR0FBRyxDQUFDSixRQUFKLENBQWE7WUFBRU0sU0FBUyxFQUFFLElBQWI7WUFBbUJKLEtBQUssRUFBRSxLQUFLSjtVQUEvQixDQUFiLENBQWY7UUFDRDs7UUFDRCxPQUFPTSxHQUFHLENBQUNDLFFBQVg7TUFDRDs7TUFDRCxPQUFPLElBQVA7SUFDRDtJQUVEO0FBQ0Y7QUFDQTtBQUNBOzs7O1dBQ0Usb0JBQTBCO01BQ3hCLE9BQU8sS0FBS1AsVUFBWjtJQUNEOzs7V0FqRUQsd0JBQWlDO01BQy9CLElBQUksQ0FBQ0YsU0FBUyxDQUFDVSxTQUFmLEVBQTBCO1FBQ3hCVixTQUFTLENBQUNVLFNBQVYsR0FBc0IsSUFBSVYsU0FBSixFQUF0QjtNQUNEOztNQUNELE9BQU9BLFNBQVMsQ0FBQ1UsU0FBakI7SUFDRDs7Ozs7QUErREg7QUFDQTtBQUNBOzs7ZUErQmVWLFMifQ==