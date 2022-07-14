const container = require('../lib');

console.log(container);

const service = {
  'SERVICE1': 'service1',
  'SERVICE2': 'service2',
  'SERVICE3': 'service3',
  'SERVICE4': 'service4',
};

container.addProps({
    date: '2022-03-18T17:00:03.030Z',
    url: 'http://example.com',
});

container.addProps({
    url2: 'http://example2.com',
});

console.log(container);

container.add(service.SERVICE1, () => new Date());
container.add(service.SERVICE2, ({ props }) => new Date(props.date));
container.add(service.SERVICE3, ({ props }) => new URL(props.url));
container.add(service.SERVICE4, ({ container: c }) => {
    const service2 = c.get(service.SERVICE2);
    const service3 = c.get(service.SERVICE3);
    return new Date(service2);
});

console.log('Before calling:', container);

const service4 = container.get(service.SERVICE4);

console.log('After calling:', container);
