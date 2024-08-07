export const containerCommonTests = (Container, memorizeMethodsMock) => {
  describe('Testing Container Common Tests', () => {
    const container = Container.getContainer();

    beforeEach(() => {
      container.context = new Map();
      container.properties = [];
    });

    it('should get the same instance always', () => {
      const container1 = Container.getContainer();
      const container2 = Container.getContainer();
      expect(container1).toBe(container2);
    });

    it('should add a new service to context', () => {
      const name = 'service1';
      const callback = () => {
        return new Date();
      };
      const response = container.add(name, callback);

      expect(response).toBe(container);
      expect(container.context.size).toBe(1);
      expect(container.context.has(name)).toBeTruthy();
      expect(container.context.keys().next()).toEqual({ value: 'service1', done: false });
      expect(container.context.get(name).callback).toBe(callback);
      expect(container.context.get(name).instance).toBeUndefined();
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
      expect(Object.keys(container.properties)).toHaveLength(2);
      expect(container.properties.param1).toBe('a1');
      expect(container.properties.param2).toBe('a2');
      expect(container.properties.param3).toBeUndefined();
      expect(container.properties.param4).toBeUndefined();
      container.addProps(configuration2);
      expect(Object.keys(container.properties)).toHaveLength(4);
      expect(container.properties.param1).toBe('a1');
      expect(container.properties.param2).toBe('a2');
      expect(container.properties.param3).toBe('a3');
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
      expect(container.context.get(name).key).toBe(name);
      expect(container.context.get(name).callback).toBe(callback);
      expect(container.context.get(name).instance).toBe(service);
    });

    it('should apply lazy loading recursively on several services', () => {
      const name1 = 'service1';
      const name2 = 'service2';
      const callback1 = () => {
        return new Date('2000-01-01T00:00:00.000Z');
      };
      const callback2 = ({ container: c }) => {
        const service1 = c.get(name1);
        return new Date(service1.getTime() + 1000);
      };
      container.add(name1, callback1);
      container.add(name2, callback2);
      const service2 = container.get(name2);

      expect(service2).toBeInstanceOf(Date);
      expect(service2.getTime()).toBe(946684801000);
      expect(container.context.get(name1).instance).toBeInstanceOf(Date);
      expect(container.context.get(name2).instance).toBeInstanceOf(Date);
      expect(container.context.get(name2).instance).toBe(service2);
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
      expect(container.context.get(name1).instance).toBeUndefined();
      expect(container.context.get(name2).instance).toBeInstanceOf(Date);
      expect(container.context.get(name2).instance).toBe(service2);
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

    it('should dont get the same instance from the same two calls (getFactory method)', () => {
      const name = 'service';
      const callback = () => {
        return new Date();
      };
      container.add(name, callback);
      const service1 = container.getFactory(name);
      const service2 = container.getFactory(name);

      expect(service1).not.toBe(service2);
    });

    it('should get null from services not set (getFactory method)', () => {
      const service = container.getFactory('notname');

      expect(service).toBeNull();
    });

    it('should get all services from the context', () => {
      const name1 = 'service1';
      const name2 = 'service2';
      const callback1 = () => new Date('2000-01-01T00:00:00.000Z');
      const callback2 = () => new Date('2000-01-01T00:00:01.000Z');
      container.add(name1, callback1);
      container.add(name2, callback2);
      const allServices = container.getAll();

      expect(allServices.service1()).toBeInstanceOf(Date);
      expect(allServices.service1().getTime()).toBe(946684800000);
      expect(allServices.service1()).toBe(container.context.get(name1).instance);

      expect(allServices.service2()).toBeInstanceOf(Date);
      expect(allServices.service2().getTime()).toBe(946684801000);
      expect(allServices.service2()).toBe(container.context.get(name2).instance);
    });

    it('getAll should return an empty object when context is empty', () => {
      const allServices = container.getAll();
      expect(allServices).toEqual({});
    });

    it('should call to the memorized function', () => {
      const name = 'service';
      const callback = () => {
        return new Date();
      };
      container.add(name, callback, { cached: true });
      container.get(name); // Call memorize method
      expect(memorizeMethodsMock).toHaveBeenCalledTimes(1);
    });
  });
};
