import Container, { Callback } from './Container';
import container from "./Container";

describe('testing core container', () => {
  const container = Container.getContainer();

  beforeEach(() => {
    // @ts-ignore
    container.context = [];
    // @ts-ignore
    container.properties = [];
  })

  it('should get the same instance always', () => {
    const container1 = Container.getContainer();
    const container2 = Container.getContainer();
    expect(container1).toBe(container2)
  });

  it('should add a new service to context', () => {
    const name = 'service1';
    const callback = () => {
      return new Date();
    };
    const response = container.add(name, callback);

    expect(response).toBe(container);
    // @ts-ignore
    expect(container.context).toHaveLength(1);
    // @ts-ignore
    expect(container.context[0].key).toBe('service1');
    // @ts-ignore
    expect(container.context[0].callback).toBe(callback);
    // @ts-ignore
    expect(container.context[0].instance).toBeUndefined();
  });

  it('should add configuration props', () => {
    const configuration1 = {
      param1: 'a1',
      param2: 'a2',
    };
    const configuration2 = {
      param3: 'a3',
      param4: 'a4',
    };
    const response = container.addProps(configuration1);

    expect(response).toBe(container);
    // @ts-ignore
    expect(Object.keys(container.properties)).toHaveLength(2);
    // @ts-ignore
    expect(container.properties.param1).toBe('a1');
    // @ts-ignore
    expect(container.properties.param2).toBe('a2');
    // @ts-ignore
    expect(container.properties.param3).toBeUndefined();
    // @ts-ignore
    expect(container.properties.param4).toBeUndefined();
    container.addProps(configuration2)
    // @ts-ignore
    expect(Object.keys(container.properties)).toHaveLength(4);
    // @ts-ignore
    expect(container.properties.param1).toBe('a1');
    // @ts-ignore
    expect(container.properties.param2).toBe('a2');
    // @ts-ignore
    expect(container.properties.param3).toBe('a3');
    // @ts-ignore
    expect(container.properties.param4).toBe('a4');
  });

  it('should get configuration props', () => {
    const configurationProps = { param1: 'a1', param2: 'a2' };
    container.addProps(configurationProps);
    const containerProps = container.getProps();

    expect(containerProps).toEqual(configurationProps);
    // It is equal, but it is not the same object
    expect(containerProps).not.toBe(configurationProps);
  });

  it('should get a service from context and apply lazy loading', () => {
    const name = 'service2';
    const callback = () => {
      return new Date('2000-01-01T00:00:00.000Z');
    };
    container.add(name, callback);
    const service = container.get(name);

    expect(service).toBeInstanceOf(Date);
    expect(service.getTime()).toBe(946684800000);
    // @ts-ignore
    expect(container.context[0].key).toBe(name);
    // @ts-ignore
    expect(container.context[0].callback).toBe(callback);
    // @ts-ignore
    expect(container.context[0].instance).toBe(service);
  });

  it('should apply lazy loading recursively on several services', () => {
    const name1 = 'service1';
    const name2 = 'service2';
    const callback1: Callback = () => {
      return new Date('2000-01-01T00:00:00.000Z');
    };
    const callback2: Callback = ({ container: c }) => {
      const service1 = c.get(name1);
      return new Date(service1.getTime() + 1000);
    };
    container.add(name1, callback1);
    container.add(name2, callback2);
    const service2 = container.get(name2);

    expect(service2).toBeInstanceOf(Date);
    expect(service2.getTime()).toBe(946684801000);
    // @ts-ignore
    expect(container.context[0].instance).toBeInstanceOf(Date);
    // @ts-ignore
    expect(container.context[1].instance).toBeInstanceOf(Date);
    // @ts-ignore
    expect(container.context[1].instance).toBe(service2);
  });

  it('should not apply lazy loading on uncalled services', () => {
    const name1 = 'service1';
    const name2 = 'service2';
    const callback1 = () => {
      return new Date('2000-01-01T00:00:00.000Z');
    };
    const callback2 = () => {
      return new Date('2000-01-01T00:00:02.000Z');
    };
    container.add(name1, callback1);
    container.add(name2, callback2);
    const service2 = container.get(name2);

    expect(service2).toBeInstanceOf(Date);
    expect(service2.getTime()).toBe(946684802000);
    // @ts-ignore
    expect(container.context[0].instance).toBeUndefined();
    // @ts-ignore
    expect(container.context[1].instance).toBeInstanceOf(Date);
    // @ts-ignore
    expect(container.context[1].instance).toBe(service2);
  });

  it('should get the same instance from the same two calls', () => {
    const name = 'service';
    const callback = () => {
      return new Date();
    };
    container.add(name, callback);
    const service1 = container.get(name);
    const service2 = container.get(name);

    expect(service1).toBe(service2);
  });

  it('should get null from services not set', () => {
    const service = container.get('notname');

    expect(service).toBeNull();
  });
});
