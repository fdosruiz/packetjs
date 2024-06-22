const container = require('../lib');

console.log(container);

container.addProps({
    date: '2022-03-18T17:00:03.030Z',
    url: 'http://example.com',
});

container.addProps({
    url2: 'http://example2.com',
});

container.add('service1', () => new Date());
container.add('service2', ({ props }) => new Date(props.date));
container.add('service3', ({ props }) => new URL(props.url));
container.add('service4', ({ container: c }) => {
    const service2 = c.get('service2');
    const service3 = c.get('service3');
    return new Date(service2);
});
container.add('service5', () => Math.random() * 1000);

console.log('Before calling:', container);

const service5_1 = container.getFactory('service5');
const service5_2 = container.getFactory('service5');
const service5_3 = container.get('service5');
const service5_4 = container.get('service5');
console.log('Factory method. service5_1 are not equal to service5_2', service5_1, service5_2, service5_1 === service5_2);
console.log('Get method (singleton). service5_3 are equal to service5_4', service5_3, service5_4, service5_3 === service5_4);

console.log('After calling factory:', container);

const service4 = container.get('service4');

console.log('After calling service4:', container);

console.log('Get props:', container.getProps());
