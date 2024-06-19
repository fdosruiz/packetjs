# Packet JS DI

[![node](https://img.shields.io/node/v/@fdosruiz/packetjs.svg?maxAge=1000)](https://www.npmjs.com/package/@fdosruiz/packetjs)
[![install size](https://packagephobia.com/badge?p=@fdosruiz/packetjs)](https://packagephobia.com/result?p=@fdosruiz/packetjs)
[![npm downloads](https://img.shields.io/npm/dm/@fdosruiz/packetjs.svg?style=flat-square)](https://npm-stat.com/charts.html?package=@fdosruiz/packetjs)
[![Build status](https://github.com/fdosruiz/packetjs/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/fdosruiz/packetjs/actions)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/fdosruiz/packetjs/blob/main/LICENSE)
[![Gihub package dependents](https://badgen.net/github/dependents-pkg/fdosruiz/packetjs)](https://github.com/fdosruiz/packetjs/network/dependents?dependent_type=PACKAGE)
[![Coverage Status](https://coveralls.io/repos/github/fdosruiz/packetjs/badge.svg?branch=main)](https://coveralls.io/github/fdosruiz/packetjs?branch=main)

Packet JS is a lightweight micro-dependency injection container for JavaScript/Node applications, written in TypeScript and with lazy loading, instantiating each service on demand with dependency on each other.

> This package was migrated from PacketJS [https://www.npmjs.com/package/@fdosruiz/packetjs](https://www.npmjs.com/package/@fdosruiz/packetjs)

## Installation

Using npm:

    npm i packetjs-di

Using yarn:

    yarn add packetjs-di

## Importing

```javascript
// Using Node.js `require()`
const container = require('packetjs-di');

// Using ES6 imports
import container from 'packetjs-di';
```

## Basic usage

Register a service:

```javascript
const container = require('packetjs-di');

container.add('Service', () => {
  return new SomeService();
});
```

In some other place:

```javascript
const container = require('packetjs-di');

// Make the instance of the service on demand, with lazy loading.
const service = container.get('Service');
```

> In both cases, `require('packetjs-di')` always get the same instance of the container.

## Adding configuration properties

It is possible to add configuration properties, for service registration or to make the configuration available throughout the application.

```javascript
const properties = require('./some-configuration-object-in-json-format');
container.addProps(properties);
```

To get the properties:

```javascript
const props = container.getProps();
```

To get the properties when registering a service:

```javascript
container.add('Service', ({ props }) => {
  return new SomeService(props.someParam);
});
```

To add new properties to existing ones:

```javascript
container.addProps({
  newProperty: { foo: 'bar' }
});
```

### Register multiples services, with dependencies on each other

For configuring the dependency Injection container, the order of registration of each service is indifferent. Each registered service will be called on demand when the main service is called.

On the other hand, the callback function receives the container and the properties as an object in the argument: `{ container, props }`:

```javascript
// Configuring some service
container.add('service', ({ container: c }) => {
    const dao = c.get('dao');
    return new Service(dao);
});

// Configuring a dependency with dao
container.add('dao', ({ container: c }) => {
    const db = c.get('db');
    return new dao(db);
});

// Configuring a database
container.add('db', ({ container: c, props: p }) => {
    return new someDatabase(
      process.env.USER,
      process.env.PASS,
      p.someConfigurationProperty
    );
});
```

In another place we can use the container like this:

```javascript
// Instantiate the services on demand, with lazy loading for each service.
const foo = container.get('service').getBar(id);
```

### Factory

If you need a factory of the registered services, you can use the `getFactory` method to always get a different instance of the service: 

```javascript
const service1 = container.getFactory('service');
const service2 = container.getFactory('service');
// service1 !== service2
```

Instead, with `get` method:

```javascript
const service1 = container.get('service');
const service2 = container.get('service');
// service1 === service2
```

### Instantiating new containers

For standalone containers, it is possible to create isolated instances by accessing the Core Container Class:

```javascript
const { Container } = require('packetjs-di/lib/core');
const a = new Container();
const b = new Container();
// a !== b
```

## Container API

| Method               | Arguments                                                                                                                                                                                                                                      | Description                                                  |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| ------------------------------------------------------------ |
| `add(key, callback)` | - `key`: Unique key for the new service or function<br/>- `callback({ container, props })`: Callback function with dependency injection logic.<br/>The callback function receives an object with the container and properties in its argument. | Add a new service or function to the container               |
| `get(key)`           | - `key`: Unique key of the service or function to get                                                                                                                                                                                          | Always get the same instance for a concrete service          |
| `getFactory(key)`    | - `key`: Unique key of the service or function to get                                                                                                                                                                                          | Always get a new instance for a concrete service             |
| `addProps(props)`    | - `props`: Configuration properties object (JSON)                                                                                                                                                                                                |                                                              |
| `getProps()`         |                                                                                                                                                                                                                                                | Gets the configuration properties object                     |
| `getContainer()`     |                                                                                                                                                                                                                                                | Always get the same instance of the container. (static method) |

## Credits

Packet JS is inspired by [pimple](https://github.com/silexphp/Pimple), a small PHP dependency injection container.

## License

[MIT](https://github.com/fdosruiz/packetjs/blob/main/LICENSE)

