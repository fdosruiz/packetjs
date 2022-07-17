# Packet JS

Packet JS is a micro-dependency injection container for JavaScript/Node applications, written in TypeScript and with lazy loading, instantiating each service on demand with dependency on each other. 

## Installation

Using npm:

```bash
$ npm install @di/packetjs
```

Using yarn:

```bash
$ yarn add @di/packetjs
```

## Importing

```javascript
// Using Node.js `require()`
const container = require('@di/packetjs');

// Using ES6 imports
import container from '@di/packetjs';
```

## Basic usage

Registering a service:

```javascript
const container = require('@di/packetjs'); // Get the container instance.

container.add('Service', () => { /* here the logic */ return new SomeService() });
```

In some other place:

```javascript
const container = require('@di/packetjs'); // Always get the same instance of the container. (singleton pattern)

const service = container.get('Service'); // Make an instance of the service on demand, with lazy loading.
```

## Adding configuration properties

It is possible to add configuration properties, for service registration and to make the configuration available throughout the application.

```javascript
const properties = require('./some-configuration-object-in-json-format');
container.addProps(properties);
```

To get the properties when registering a service:

```javascript
container.add('Service', ({ props }) => { /* here the logic */ return new SomeService(props.someParam) });
```

Also, we can get all the properties:

```javascript
const props = container.getProps();
```

### Factory with multiples dependencies

For configuring the dependency Injection container, the order of registration of each service is indifferent. The callback function receives the container and the properties as an object in the argument: `{ container, props }`:

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
    return new someDatabase(process.env.USER, process.PASS, p.someConfigurationProp);
});
```

In another place we can use the container like this:

```javascript
cosnt something = container.get('service').getSomeThing(id); // Makes an instance of the service with lazy loading for each service.
```

### Instantiating new containers

If you need standalone containers, it is possible to create isolated instances by accessing the Core Container Class:

```javascript
const { Container } = require('packetjs/lib/core');
const a = new Container();
const b = new Container();
// a !== b
```

## Credits

Packet JS is inspired by [pimple](https://github.com/silexphp/Pimple) , a small PHP dependency injection container.

## License

[MIT](https://github.com/fdosruiz/packetjs/blob/main/LICENSE)

