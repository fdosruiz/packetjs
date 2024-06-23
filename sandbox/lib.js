const container = require('../lib');

// Empty container
console.log(container);

// Add properties
container.addProps({
    date: '2022-03-18T17:00:03.030Z',
    url: 'http://example.com',
});

// Add services
container.add('service1', () => new Date());
container.add('service2', ({ props }) => new Date(props.date));
container.add('service3', ({ props }) => new URL(props.url));
container.add('service4', ({ container: c }) => {
    const service2 = c.get('service2');
    const service3 = c.get('service3');
    return new Date(service2);
});
container.add('service5', () => Math.random() * 1000);

// Add new properties
container.addProps({
    url2: 'http://example2.com',
});

// Get services
console.log('Before calling:', container);
const service5_1 = container.getFactory('service5');
const service5_2 = container.getFactory('service5');
const service5_3 = container.get('service5');
const service5_4 = container.get('service5');

// Check if service5_1 and service5_2 are not the same
console.log('Factory method. service5_1 are not equal to service5_2', service5_1, service5_2, service5_1 === service5_2);
console.log('Get method (singleton). service5_3 are equal to service5_4', service5_3, service5_4, service5_3 === service5_4);

// Call service 4
console.log('After calling factory:', container);
container.get('service4');
console.log('After calling service4:', container);

// Get properties object
console.log('Get props:', container.getProps());

// Get all services
container.add('service6', ({ props }) => new Date(props.date));
container.add('service7', ({ props }) => new URL(props.url));
console.log('Get all services (get(key) callback functions):', container.getAll());
const {
  service6,
  service7,
} = container.getAll();

// Only get instance from called services
console.log(container);
console.log('Services (get(key) callback): ', service6, service7);
console.log('Services (instance): ', service6());
console.log(container);
