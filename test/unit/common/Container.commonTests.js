export const containerCommonTests = (Container, mocks) => {
  describe('Common Unit Testing for Container (lib + src)', () => {
    const container = Container.getContainer();
    const { middlewareGetProxyMock } = mocks;
    const serviceFunction = new Date('2000-01-01T00:00:00.000Z');

    beforeEach(() => {
      container.context = new Map();
      container.properties = [];
      middlewareGetProxyMock.mockReturnValue('Proxy Instance');
    });

    describe('global tests', () => {
      it('should get the same instance always', () => {
        const container1 = Container.getContainer();
        const container2 = Container.getContainer();
        expect(container1).toBe(container2);
      });
    });

    describe('testing addProps method', () => {
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
    });

    describe('testing add method', () => {
      it('should add a new service to context', () => {
        const name = 'service1';
        const callback = () => {
          return new Date();
        };
        const response = container.add(name, callback);

        expect(response).toBeTruthy();
        expect(container.context.size).toBe(1);
        expect(container.context.has(name)).toBeTruthy();
        expect(container.context.keys().next()).toEqual({ value: 'service1', done: false });
        expect(container.context.get(name).callback).toBe(callback);
        expect(container.context.get(name).instance).toBeNull();
        expect(container.context.get(name).options).toBeUndefined();
      });

      it('should add a new service to context with cache options', () => {
        const name = 'service1';
        const callback = () => {
          return new Date();
        };
        const options = { cached: true, methods: [ 'someMethod' ], excludeMode: false };
        const response = container.add(name, callback, options);

        expect(response).toBeTruthy();
        expect(container.context.size).toBe(1);
        expect(container.context.has(name)).toBeTruthy();
        expect(container.context.keys().next()).toEqual({ value: 'service1', done: false });
        expect(container.context.get(name).callback).toBe(callback);
        expect(container.context.get(name).instance).toBeNull();
        expect(container.context.get(name).options).toEqual(options);
      });

      it('add multiple services with the same name. Should return the last one', () => {
        const service1 = new Date();
        const service2 = new Date();
        const service3 = new Date();

        container.add('Duplicate', () => service1);
        container.add('Duplicate', () => service2);
        container.add('Duplicate', () => service3);

        const Duplicate = container.get('Duplicate', true);

        expect(Duplicate).not.toBe(service1);
        expect(Duplicate).not.toBe(service2);
        expect(Duplicate).toBe(service3);
      });

      it('add multiple services with the same name. Should return the first one with freeze mode', () => {
        const service1 = new Date();
        const service2 = new Date();
        const service3 = new Date();

        container.add('Duplicate2', () => service1, { freeze: true });
        container.add('Duplicate2', () => service2);
        container.add('Duplicate2', () => service3);

        const Duplicate2 = container.get('Duplicate2', true);

        expect(Duplicate2).toBe(service1);
        expect(Duplicate2).not.toBe(service2);
        expect(Duplicate2).not.toBe(service3);
      });
    });

    describe('testing get method', () => {
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
        middlewareGetProxyMock.mockReturnValue(serviceFunction);
        const callback = () => {
          return serviceFunction;
        };
        container.add(name, callback);

        // Before the service was called
        expect(container.context.get(name).instance).toBeNull();
        expect(container.context.get(name).proxy).toBeNull();

        // After the service was called
        const service = container.get(name);
        expect(service).toBeInstanceOf(Date);
        expect(service.getTime()).toBe(946684800000);
        expect(container.context.get(name).key).toBe(name);
        expect(container.context.get(name).callback).toBe(callback);
        expect(container.context.get(name).instance).toBe(service);
        expect(container.context.get(name).proxy).toBe(service);

        // should call to the middleware getProxy function
        expect(middlewareGetProxyMock).toHaveBeenCalledTimes(1);
      });

      it('should get a service from context and apply the default proxy instance', () => {
        const name = 'service1';
        const callback = () => {
          return serviceFunction;
        };
        container.add(name, callback);

        // Before the service was called
        expect(container.context.get(name).instance).toBeNull();
        expect(container.context.get(name).proxy).toBeNull();

        // After the service was called
        const service = container.get(name);
        expect(service).toBe('Proxy Instance');
        expect(container.context.get(name).instance).toBe(serviceFunction);
        expect(container.context.get(name).proxy).toBe('Proxy Instance');

        // should call to the middleware getProxy function
        expect(middlewareGetProxyMock).toHaveBeenCalledTimes(1);
      });

      it('should get a service from context and do not apply the proxy instance with disableProxy flag', () => {
        const name = 'service1';
        const callback = () => {
          return serviceFunction;
        };
        container.add(name, callback);

        // Before the service was called
        expect(container.context.get(name).instance).toBeNull();
        expect(container.context.get(name).proxy).toBeNull();

        // After the service was called
        const service = container.get(name, true);
        expect(service).toBe(serviceFunction);
        expect(container.context.get(name).instance).toBe(service);
        expect(container.context.get(name).proxy).toBe('Proxy Instance');

        // should call to the middleware getProxy function
        expect(middlewareGetProxyMock).toHaveBeenCalledTimes(1);
      });

      it('should apply lazy loading recursively on several services', () => {
        const name1 = 'service1';
        const name2 = 'service2';
        const callback1 = () => {
          return new Date('2000-01-01T00:00:00.000Z');
        };
        const callback2 = ({ container: c }) => {
          const service1 = c.get(name1, true);
          return new Date(service1.getTime() + 1000);
        };
        container.add(name1, callback1);
        container.add(name2, callback2);
        const service2 = container.get(name2, true);

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
        const service2 = container.get(name2, true);

        expect(service2).toBeInstanceOf(Date);
        expect(service2.getTime()).toBe(946684802000);
        expect(container.context.get(name1).instance).toBeNull();
        expect(container.context.get(name2).instance).toBeInstanceOf(Date);
        expect(container.context.get(name2).instance).toBe(service2);
      });

      it('should get the same instance from the same two calls', () => {
        const name = 'service';
        const callback = () => {
          return new Date();
        };
        container.add(name, callback);
        const service1 = container.get(name, true);
        const service2 = container.get(name, true);

        expect(service1).toBe(service2);
      });

      it('should get null from services not set', () => {
        const service = container.get('not-name');

        expect(service).toBeNull();
      });
    });

    describe('testing getFactory method', () => {
      it('should dont get the same instance from the same two calls', () => {
        const name = 'service';
        const callback = () => {
          return new Date();
        };
        container.add(name, callback);
        const service1 = container.getFactory(name, true);
        const service2 = container.getFactory(name, true);

        expect(service1).not.toBe(service2);
      });

      it('should get a proxy instance when disableProxy is false (default)', () => {
        const name = 'service';
        const callback = () => {
          return serviceFunction;
        };
        container.add(name, callback);
        const service = container.getFactory(name);

        expect(service).toBe('Proxy Instance');
        expect(container.context.get(name).instance).toBeNull();
        expect(container.context.get(name).proxy).toBeNull();
      });

      it('should get the original instance when disableProxy is true', () => {
        const name = 'service';
        const callback = () => {
          return serviceFunction;
        };
        container.add(name, callback);
        const service = container.getFactory(name, true);

        expect(service).toBe(serviceFunction);
        expect(container.context.get(name).instance).toBeNull();
        expect(container.context.get(name).proxy).toBeNull();
      });

      it('should get null from services not set', () => {
        const service = container.getFactory('not-name');

        expect(service).toBeNull();
      });
    });

    describe('Testing getAll method', () => {
      it('should get all services from the context', () => {
        const name1 = 'service1';
        const name2 = 'service2';
        const callback1 = () => new Date('2000-01-01T00:00:00.000Z');
        const callback2 = () => new Date('2000-01-01T00:00:01.000Z');
        container.add(name1, callback1);
        container.add(name2, callback2);
        const allServices = container.getAll(true);

        expect(allServices.service1()).toBeInstanceOf(Date);
        expect(allServices.service1().getTime()).toBe(946684800000);
        expect(allServices.service1()).toBe(container.context.get(name1).instance);

        expect(allServices.service2()).toBeInstanceOf(Date);
        expect(allServices.service2().getTime()).toBe(946684801000);
        expect(allServices.service2()).toBe(container.context.get(name2).instance);
      });

      it('should get all services with the proxy instance when disableProxy is false (default)', () => {
        const name1 = 'service1';
        const name2 = 'service2';
        const serviceFunction1 = new Date('2000-01-01T00:00:00.000Z');
        const serviceFunction2 = new Date('2000-01-01T00:00:01.000Z');
        const callback1 = () => serviceFunction1;
        const callback2 = () => serviceFunction2;
        container.add(name1, callback1);
        container.add(name2, callback2);
        const allServices = container.getAll();

        // Service 1
        expect(allServices.service1()).toBe('Proxy Instance');
        expect(container.context.get(name1).instance).toBe(serviceFunction1);
        expect(container.context.get(name1).proxy).toBe('Proxy Instance');

        // Service 2
        expect(allServices.service2()).toBe('Proxy Instance');
        expect(container.context.get(name2).instance).toBe(serviceFunction2);
        expect(container.context.get(name2).proxy).toBe('Proxy Instance');
      });

      it('should get all services with the original instance when disableProxy is true', () => {
        const name1 = 'service1';
        const name2 = 'service2';
        const serviceFunction1 = new Date('2000-01-01T00:00:00.000Z');
        const serviceFunction2 = new Date('2000-01-01T00:00:01.000Z');
        const callback1 = () => serviceFunction1;
        const callback2 = () => serviceFunction2;
        container.add(name1, callback1);
        container.add(name2, callback2);
        const allServices = container.getAll(true);

        // Service 1
        expect(allServices.service1()).toBe(serviceFunction1);
        expect(container.context.get(name1).instance).toBe(serviceFunction1);
        expect(container.context.get(name1).proxy).toBe('Proxy Instance');

        // Service 2
        expect(allServices.service2()).toBe(serviceFunction2);
        expect(container.context.get(name2).instance).toBe(serviceFunction2);
        expect(container.context.get(name2).proxy).toBe('Proxy Instance');
      });

      it('getAll should return an empty object when context is empty', () => {
        const allServices = container.getAll();
        expect(allServices).toEqual({});
      });
    });

    describe('Testing purge method', () => {
      it('should purge the context for a concrete service', () => {
        const name1 = 'service1';
        const name2 = 'service2';
        const callback1 = () => new Date('2000-01-01T00:00:00.000Z');
        const callback2 = () => new Date('2000-01-01T00:00:01.000Z');
        container.add(name1, callback1);
        container.add(name2, callback2);

        const service1 = container.get(name1, true);
        const service2 = container.get(name2, true);

        expect(service1).toBeInstanceOf(Date);
        expect(service2).toBeInstanceOf(Date);

        expect(container.context.get(name1).instance).toBeInstanceOf(Date);
        expect(container.context.get(name1).proxy).toBe('Proxy Instance');

        expect(container.context.get(name2).instance).toBeInstanceOf(Date);
        expect(container.context.get(name2).proxy).toBe('Proxy Instance');

        // Purge service 1
        expect(container.purge(name1)).toBeTruthy();
        expect(container.context.get(name1).instance).toBeNull();
        expect(container.context.get(name1).proxy).toBeNull();

        // Service 2 should not be purged
        expect(container.context.get(name2).instance).toBeInstanceOf(Date);
        expect(container.context.get(name2).proxy).toBe('Proxy Instance');
      });

      it('should dont purge the context for a non existent service', () => {
        const name = 'non-existent-service';
        expect(container.context.get(name)).toBeUndefined();
        expect(container.purge(name)).toBeFalsy();
      });
    });
  });
};