import uniqid from 'uniqid';

export const middlewareCommonTests = (Middleware, Container) => {
  describe('Common Unit Testing for Middleware (lib + src)', () => {
    let container;
    let middlewareInstance;
    let instance;
    let ctx;
    let instanceTestService;
    let ctxTestService;
    const testService = () => {
      const nonFunctionProperty = 'This is not a function';
      const doTimeout = (time) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(`time lapsed: ${time}`), time);
        });
      };
      const fetch = (arg) => {
        if (!arg) {
          return 'Response of fetch method without args';
        }
        return arg === 'overrideRequest'
          ? 'Response of fetch method with args override'
          : `Response of fetch method with arg: ${arg}`;
      };
      const getRandom1 = () => Math.random() * 1000;
      const getRandom2 = () => Math.random() * 1000;
      const getUniqid = () => uniqid();
      return {
        nonFunctionProperty,
        doTimeout,
        fetch,
        getRandom1,
        getRandom2,
        getUniqid,
      };
    };
    const containerService = () => {
      const fetch = (arg) => {
        if (!arg) {
          return 'Response of containerService without args';
        }
        return `Response of containerService with args: ${arg}`;
      };
      return {
        fetch,
      };
    };

    beforeEach(() => {
      container = new Container();
      middlewareInstance = new Middleware(container);
      instance = new Date();
      ctx = { key: 'Service', instance };
      instanceTestService = testService();
      ctxTestService = { key: 'testService', instance: instanceTestService };
      container.add('containerService', () => containerService());
      container.add('testService', () => testService());
    });

    describe('Adding middlewares', () => {
      const middleware1 = (next) => next();
      const middleware2 = (next) => next();
      const middleware3 = (next) => next();

      it('should add a middleware to the middlewares stack', () => {
        middlewareInstance.add('Service', middleware1);

        // Check if the middleware is added to the middlewares stack
        expect(middlewareInstance.middlewareStack.size).toBe(1);
        expect(middlewareInstance.middlewareStack.get('Service')).toHaveLength(1);
        expect(middlewareInstance.middlewareStack.get('Service')[0]).toEqual({
            global: false,
            middleware: middleware1,
            name: undefined,
            priority: undefined,
          },
        );
      });

      it('should add a set of middlewares with the same key | priority will be in order of declaration', () => {
        // Add middlewares
        middlewareInstance.add('Service', middleware1, { name: 'middleware1' });
        middlewareInstance.add('Service', middleware2, { name: 'middleware2' });
        middlewareInstance.add('Service', middleware3, { name: 'middleware3' });

        // Check if the middleware is added to the middlewares stack
        expect(middlewareInstance.middlewareStack.size).toBe(1);
        expect(middlewareInstance.middlewareStack.get('Service')).toHaveLength(3);

        // First middleware will be added with the highest priority
        expect(middlewareInstance.middlewareStack.get('Service')[0]).toEqual({
            global: false,
            middleware: middleware1,
            name: 'middleware1',
            priority: undefined,
          },
        );

        // Second middleware will be added with the second-highest priority
        expect(middlewareInstance.middlewareStack.get('Service')[1]).toEqual({
            global: false,
            middleware: middleware2,
            name: 'middleware2',
            priority: undefined,
          },
        );

        // Third middleware will be added with the lowest priority
        expect(middlewareInstance.middlewareStack.get('Service')[2]).toEqual({
            global: false,
            middleware: middleware3,
            name: 'middleware3',
            priority: undefined,
          },
        );
      });

      it('should add a set of middlewares with the same key | priority will be define by options', () => {
        // Add middlewares with different priority. Higher priority will be added first
        middlewareInstance.add('Service', middleware1, { priority: 1, name: 'middleware1' });
        middlewareInstance.add('Service', middleware2, { priority: 2, name: 'middleware2' });
        middlewareInstance.add('Service', middleware3, { priority: 3, name: 'middleware3' });

        // Check if the middleware is added to the middlewares stack
        expect(middlewareInstance.middlewareStack.size).toBe(1);
        expect(middlewareInstance.middlewareStack.get('Service')).toHaveLength(3);

        // First middleware will be added with the highest priority
        expect(middlewareInstance.middlewareStack.get('Service')[0]).toEqual({
            global: false,
            middleware: middleware3,
            name: 'middleware3',
            priority: 3,
          },
        );

        // Second middleware will be added with the second-highest priority
        expect(middlewareInstance.middlewareStack.get('Service')[1]).toEqual({
            global: false,
            middleware: middleware2,
            name: 'middleware2',
            priority: 2,
          },
        );

        // Third middleware will be added with the lowest priority
        expect(middlewareInstance.middlewareStack.get('Service')[2]).toEqual({
            global: false,
            middleware: middleware1,
            name: 'middleware1',
            priority: 1,
          },
        );
      });

      it('should add a set of global middlewares | priority will be in order of declaration', () => {
        // Add middlewares
        middlewareInstance.addGlobal(middleware1, { name: 'global_middleware1' });
        middlewareInstance.addGlobal(middleware2, { name: 'global_middleware2' });
        middlewareInstance.addGlobal(middleware3, { name: 'global_middleware3' });

        // Check if the middleware is added to the middlewares stack
        expect(middlewareInstance.middlewareStack.size).toBe(1);
        expect(middlewareInstance.middlewareStack.get('global')).toHaveLength(3);

        // First middleware will be added with the highest priority
        expect(middlewareInstance.middlewareStack.get('global')[0]).toEqual({
            global: true,
            middleware: middleware1,
            name: 'global_middleware1',
            priority: undefined,
          },
        );

        // Second middleware will be added with the second-highest priority
        expect(middlewareInstance.middlewareStack.get('global')[1]).toEqual({
            global: true,
            middleware: middleware2,
            name: 'global_middleware2',
            priority: undefined,
          },
        );

        // Third middleware will be added with the lowest priority
        expect(middlewareInstance.middlewareStack.get('global')[2]).toEqual({
            global: true,
            middleware: middleware3,
            name: 'global_middleware3',
            priority: undefined,
          },
        );
      });

      it('should add a set of global middlewares | priority will be define by options', () => {
        // Add global middlewares with different priority. Higher priority will be added first
        middlewareInstance.addGlobal(middleware1, { priority: 1, name: 'global_middleware1' });
        middlewareInstance.addGlobal(middleware2, { priority: 2, name: 'global_middleware2' });
        middlewareInstance.addGlobal(middleware3, { priority: 3, name: 'global_middleware3' });

        // Check if the middleware is added to the middlewares stack
        expect(middlewareInstance.middlewareStack.size).toBe(1);
        expect(middlewareInstance.middlewareStack.get('global')).toHaveLength(3);

        // First middleware will be added with the highest priority
        expect(middlewareInstance.middlewareStack.get('global')[0]).toEqual({
            global: true,
            middleware: middleware3,
            name: 'global_middleware3',
            priority: 3,
          },
        );

        // Second middleware will be added with the second-highest priority
        expect(middlewareInstance.middlewareStack.get('global')[1]).toEqual({
            global: true,
            middleware: middleware2,
            name: 'global_middleware2',
            priority: 2,
          },
        );

        // Third middleware will be added with the lowest priority
        expect(middlewareInstance.middlewareStack.get('global')[2]).toEqual({
            global: true,
            middleware: middleware1,
            name: 'global_middleware1',
            priority: 1,
          },
        );
      });
    });

    describe('Getting proxy', () => {
      const middleware1 = (next) => next();
      const middleware2 = (next) => next();
      const middleware3 = (next) => next();

      it('should get and undefined proxy from the given context', () => {
        const ctx = { key: 'Service' };
        const proxy = middlewareInstance.getProxy(ctx);

        expect(proxy).toBeUndefined();
        expect(middlewareInstance.middlewareStack.size).toBe(0);
      });

      it('should get the instance from context if there is no middlewares registered', () => {
        const instance = new Date();
        const ctx = { key: 'Service', instance };
        const proxy = middlewareInstance.getProxy(ctx);

        expect(proxy).toBe(instance);
        expect(middlewareInstance.middlewareStack.size).toBe(0);
      });

      it('should get a proxy for the given context if there is middlewares registered', () => {
        const instance = new Date();
        const ctx = { key: 'Service', instance };

        // Add middlewares
        middlewareInstance.add('Service', middleware1, { name: 'middleware1' });
        middlewareInstance.add('Service', middleware2, { name: 'middleware2' });
        middlewareInstance.add('Service', middleware3, { name: 'middleware3' });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctx);

        // Proxy should be a proxy, not the direct instance
        expect(proxy).not.toBe(instance);

        // Check if the middleware is added to the middlewares stack
        expect(middlewareInstance.middlewareStack.size).toBe(1);
        expect(middlewareInstance.middlewareStack.get('Service')).toHaveLength(3);
      });

      it('should get a proxy for the given context with cache enabled if there is middlewares registered', () => {
        const instance = new Date();
        const ctx = { key: 'Service', instance, options: { cache: true } };

        // Add middlewares
        middlewareInstance.add('Service', middleware1, { name: 'middleware1' });
        middlewareInstance.add('Service', middleware2, { name: 'middleware2' });
        middlewareInstance.add('Service', middleware3, { name: 'middleware3' });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctx);

        // Proxy should be a proxy, not the direct instance
        expect(proxy).not.toBe(instance);

        // Check if the middleware is added to the middlewares stack
        expect(middlewareInstance.middlewareStack.size).toBe(1);
        expect(middlewareInstance.middlewareStack.get('Service')).toHaveLength(4);

        // Check if the cache middleware is added to the middlewares stack
        expect(middlewareInstance.middlewareStack.get('Service')[3]).toEqual({
          global: false,
          middleware: expect.any(Function),
          name: 'Cache',
          priority: -1000,
        });
      });

      it('should get the instance from context when instance is not an object', () => {
        const instance = 'This instance is not an object';
        const ctx = { key: 'Service', instance };
        const middleware1 = (next) => next();

        // Add middlewares
        middlewareInstance.add('Service', middleware1, { name: 'middleware1' });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctx);

        // Proxy should be the instance, should not be a proxy
        expect(proxy).toBe(instance);
        expect(middlewareInstance.middlewareStack.size).toBe(1);
        expect(middlewareInstance.middlewareStack.get('Service')).toHaveLength(1);
      });
    });

    describe('Executing proxy', () => {
      const middleware1 = (next, context, args) => {
        const [argument1, argument2, argument3] = args;
        argument1.push('middleware1 before');
        argument2.push(`middleware1 context | methodName: ${context.methodName} | serviceName: ${context.serviceName}`);
        const result = next();
        argument1.push('middleware1 after');
        argument3.push(result);
        return result;
      };
      const middleware2 = (next, context, args) => {
        const [argument1, argument2, argument3] = args;
        argument1.push('middleware2 before');
        argument2.push(`middleware2 context | methodName: ${context.methodName} | serviceName: ${context.serviceName}`);
        const result = next();
        argument1.push('middleware2 after');
        argument3.push(result);
        return result;
      };
      const middleware3 = (next, context, args) => {
        const [argument1, argument2, argument3] = args;
        argument1.push('middleware3 before');
        argument2.push(`middleware3 context | methodName: ${context.methodName} | serviceName: ${context.serviceName}`);
        const result = next();
        argument1.push('middleware3 after');
        argument3.push(result);
        return result;
      };
      const globalMiddleware1 = (next, context, args) => {
        const [argument1, argument2, argument3] = args;
        argument1.push('global middleware1 before');
        argument2.push(`global middleware1 context | methodName: ${context.methodName} | serviceName: ${context.serviceName}`);
        const result = next();
        argument1.push('global middleware1 after');
        argument3.push(result);
        return result;
      };
      const globalMiddleware2 = (next, context, args) => {
        const [argument1, argument2, argument3] = args;
        argument1.push('global middleware2 before');
        argument2.push(`global middleware2 context | methodName: ${context.methodName} | serviceName: ${context.serviceName}`);
        const result = next();
        argument1.push('global middleware2 after');
        argument3.push(result);
        return result;
      };
      const globalMiddleware3 = (next, context, args) => {
        const [argument1, argument2, argument3] = args;
        argument1.push('global middleware3 before');
        argument2.push(`global middleware3 context | methodName: ${context.methodName} | serviceName: ${context.serviceName}`);
        const result = next();
        argument1.push('global middleware3 after');
        argument3.push(result);
        return result;
      };

      it('proxy should run every registered middleware | service middlewares', () => {
        // Add middlewares
        middlewareInstance.add('Service', middleware1, { name: 'middleware1', priority: 0 });
        middlewareInstance.add('Service', middleware2, { name: 'middleware2', priority: 0 });
        middlewareInstance.add('Service', middleware3, { name: 'middleware3', priority: 0 });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctx);

        // Run proxy
        const argument1 = [];
        const argument2 = [];
        const argument3 = [];
        const result = proxy.getTime(argument1, argument2, argument3);

        // Check if the order of the middlewares is correct
        expect(argument1).toEqual([
          'middleware1 before',
          'middleware2 before',
          'middleware3 before',
          'middleware3 after',
          'middleware2 after',
          'middleware1 after',
        ]);

        // Check if the context is correct
        expect(argument2).toEqual([
          'middleware1 context | methodName: getTime | serviceName: Service',
          'middleware2 context | methodName: getTime | serviceName: Service',
          'middleware3 context | methodName: getTime | serviceName: Service',
        ]);

        // Check if the result is correct
        expect(argument3[0]).toBe(result);
        expect(argument3[1]).toBe(result);
        expect(argument3[2]).toBe(result);
      });

      it('proxy should run every registered middleware | service middlewares together with global middlewares', () => {
        // Add middlewares
        middlewareInstance.add('Service', middleware1, { name: 'middleware1', priority: 0 });
        middlewareInstance.add('Service', middleware2, { name: 'middleware2', priority: 0 });
        middlewareInstance.add('Service', middleware3, { name: 'middleware3', priority: 0 });
        middlewareInstance.addGlobal(globalMiddleware1, { name: 'global_middleware1', priority: 0 });
        middlewareInstance.addGlobal(globalMiddleware2, { name: 'global_middleware2', priority: 0 });
        middlewareInstance.addGlobal(globalMiddleware3, { name: 'global_middleware3', priority: 0 });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctx);

        // Run proxy
        const argument1 = [];
        const argument2 = [];
        const argument3 = [];
        const result = proxy.getTime(argument1, argument2, argument3);

        // Check if the order of the middlewares is correct. Global middlewares should be executed first
        expect(argument1).toEqual([
          'global middleware1 before',
          'global middleware2 before',
          'global middleware3 before',
          'middleware1 before',
          'middleware2 before',
          'middleware3 before',
          'middleware3 after',
          'middleware2 after',
          'middleware1 after',
          'global middleware3 after',
          'global middleware2 after',
          'global middleware1 after',
        ]);

        // Check if the context is correct. Global middlewares should be executed first
        expect(argument2).toEqual([
          'global middleware1 context | methodName: getTime | serviceName: Service',
          'global middleware2 context | methodName: getTime | serviceName: Service',
          'global middleware3 context | methodName: getTime | serviceName: Service',
          'middleware1 context | methodName: getTime | serviceName: Service',
          'middleware2 context | methodName: getTime | serviceName: Service',
          'middleware3 context | methodName: getTime | serviceName: Service',
        ]);

        // Check if the result is correct
        expect(argument3[0]).toBe(result);
        expect(argument3[1]).toBe(result);
        expect(argument3[2]).toBe(result);
        expect(argument3[3]).toBe(result);
        expect(argument3[4]).toBe(result);
        expect(argument3[5]).toBe(result);
      });

      it('should dont run middlewares when call non function properties', () => {
        // Add middlewares
        middlewareInstance.add('testService', middleware1, { name: 'middleware1', priority: 0 });
        middlewareInstance.add('testService', middleware2, { name: 'middleware2', priority: 0 });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctxTestService);

        // Run proxy
        const argument1 = [];
        const argument2 = [];
        const argument3 = [];
        const result = proxy.nonFunctionProperty;
        expect(() => { proxy.nonFunctionProperty(argument1, argument2, argument3); }).toThrowError();
        expect(result).toBe('This is not a function');

        // Middlewares should not be executed
        expect(argument1).toEqual([]);
        expect(argument2).toEqual([]);
        expect(argument3).toEqual([]);
      });

      it('should return an error when call next multiple times', () => {
        const middleware1 = (next, context, args) => {
          next(args); // call next() multiple times
          return next(args);
        };
        const middleware2 = (next, context, args) => {
          return next(args);
        };

        // Add middlewares
        middlewareInstance.add('Service', middleware1, { name: 'middleware1', priority: 0 });
        middlewareInstance.add('Service', middleware2, { name: 'middleware2', priority: 0 });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctx);

        // Run proxy and check if an error is thrown
        expect(() => { proxy.getTime(); }).toThrowError('next() called multiple times');
      });

      it('proxy should run every registered middleware | service middlewares | by priority', () => {
        // Add middlewares
        middlewareInstance.add('Service', middleware1, { name: 'middleware1', priority: 0 });
        middlewareInstance.add('Service', middleware2, { name: 'middleware2', priority: 10 });
        middlewareInstance.add('Service', middleware3, { name: 'middleware3', priority: 20 });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctx);

        // Run proxy
        const argument1 = [];
        const argument2 = [];
        const argument3 = [];
        const result = proxy.getTime(argument1, argument2, argument3);

        // Check if the order of the middlewares is correct
        expect(argument1).toEqual([
          'middleware3 before',
          'middleware2 before',
          'middleware1 before',
          'middleware1 after',
          'middleware2 after',
          'middleware3 after',
        ]);

        // Check if the context is correct
        expect(argument2).toEqual([
          'middleware3 context | methodName: getTime | serviceName: Service',
          'middleware2 context | methodName: getTime | serviceName: Service',
          'middleware1 context | methodName: getTime | serviceName: Service',
        ]);

        // Check if the result is correct
        expect(argument3[0]).toBe(result);
        expect(argument3[1]).toBe(result);
        expect(argument3[2]).toBe(result);
      });

      it('proxy should run every registered middleware | service middlewares together with global middlewares | by priority', () => {
        // Add middlewares
        middlewareInstance.add('Service', middleware1, { name: 'middleware1', priority: 10 });
        middlewareInstance.add('Service', middleware2, { name: 'middleware2', priority: 20 });
        middlewareInstance.add('Service', middleware3, { name: 'middleware3', priority: 30 });
        middlewareInstance.addGlobal(globalMiddleware1, { name: 'global_middleware1', priority: 1 });
        middlewareInstance.addGlobal(globalMiddleware2, { name: 'global_middleware2', priority: 2 });
        middlewareInstance.addGlobal(globalMiddleware3, { name: 'global_middleware3', priority: 3 });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctx);

        // Run proxy
        const argument1 = [];
        const argument2 = [];
        const argument3 = [];
        const result = proxy.getTime(argument1, argument2, argument3);

        // Check if the order of the middlewares is correct. Global middlewares should be executed first
        expect(argument1).toEqual([
          'global middleware3 before',
          'global middleware2 before',
          'global middleware1 before',
          'middleware3 before',
          'middleware2 before',
          'middleware1 before',
          'middleware1 after',
          'middleware2 after',
          'middleware3 after',
          'global middleware1 after',
          'global middleware2 after',
          'global middleware3 after',
        ]);

        // Check if the context is correct. Global middlewares should be executed first
        expect(argument2).toEqual([
          'global middleware3 context | methodName: getTime | serviceName: Service',
          'global middleware2 context | methodName: getTime | serviceName: Service',
          'global middleware1 context | methodName: getTime | serviceName: Service',
          'middleware3 context | methodName: getTime | serviceName: Service',
          'middleware2 context | methodName: getTime | serviceName: Service',
          'middleware1 context | methodName: getTime | serviceName: Service',
        ]);

        // Check if the result is correct
        expect(argument3[0]).toBe(result);
        expect(argument3[1]).toBe(result);
        expect(argument3[2]).toBe(result);
        expect(argument3[3]).toBe(result);
        expect(argument3[4]).toBe(result);
        expect(argument3[5]).toBe(result);
      });

      it('service should receive the params without args in the next function', () => {
        const middleware = (next) => {
          return next();
        };
        // Add middlewares
        middlewareInstance.add('Service', middleware, { name: 'middleware1' });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctxTestService);

        // After calling Request service
        expect(proxy.fetch('param1')).toBe('Response of fetch method with arg: param1');
      });

      it('middleware should receive the request of an asynchronous instance (Handle instance promises)', (done) => {
        const promiseInstance = new Promise((resolve) => {
          resolve(testService());
        });

        const middleware = (next, context, args) => {
          expect(context.methodName).toBe('fetch');
          expect(context.serviceName).toBe('promiseService');
          return next(args);
        };
        // Add middlewares
        middlewareInstance.add('promiseService', middleware, { name: 'middleware1' });

        // Get proxy
        const promiseProxy = middlewareInstance.getProxy({
          key: 'promiseService',
          instance: promiseInstance,
        });

        promiseProxy.then((proxy) => {
          // After calling Request service
          expect(proxy.fetch('param1')).toBe('Response of fetch method with arg: param1');
          done();
        });
      });

      it('middleware should receive an error of an asynchronous instance (Handle instance promises)', (done) => {
        const promiseInstanceError = new Promise((resolve, reject) => {
          reject('error instancing promiseService');
        });

        const middleware = (next, context, args) => {
          expect(context.methodName).toBe('fetch');
          expect(context.serviceName).toBe('promiseService');
          return next(args);
        };
        // Add middlewares
        middlewareInstance.add('promiseService', middleware, { name: 'middleware1' });

        // Get proxy
        const promiseProxy = middlewareInstance.getProxy({
          key: 'promiseService',
          instance: promiseInstanceError,
        });

        promiseProxy.then(() => {
          done();
        }).catch((error) => {
          expect(error).toBe('error instancing promiseService');
          done();
        });
      });
    });

    describe('Override requests in middleware', () => {
      const middleware1 = (next, context, args) => {
        const [argument1, argument2, argument3] = args;
        argument2.push('middleware1 before');
        const result = next(argument1 === 'overrideArgs' ? ['overrideRequest', argument2, argument3] : args);
        argument2.push('middleware1 after');
        argument3.push(result);
        return argument1 === 'override1'
          ? 'Override Request from middleware1'
          : result;
      };
      const middleware2 = (next, context, args) => {
        const [argument1, argument2, argument3] = args;
        argument2.push('middleware2 before');
        const result = next(argument1 === 'overrideArgs' ? ['overrideRequest', argument2, argument3] : args);
        argument2.push('middleware2 after');
        argument3.push(result);
        return argument1 === 'override2'
          ? 'Override Request from middleware2'
          : result;
      };
      const globalMiddleware1 = (next, context, args) => {
        const [argument1, argument2, argument3] = args;
        argument2.push('global middleware1 before');
        const result = next(argument1 === 'overrideArgs' ? ['overrideRequest', argument2, argument3] : args);
        argument2.push('global middleware1 after');
        argument3.push(result);
        return argument1 === 'globalOverride1'
          ? 'Override Request from global middleware1'
          : result;
      };
      const globalMiddleware2 = (next, context, args) => {
        const [argument1, argument2, argument3] = args;
        argument2.push('global middleware2 before');
        const result = next(argument1 === 'overrideArgs' ? ['overrideRequest', argument2, argument3] : args);
        argument2.push('global middleware2 after');
        argument3.push(result);
        return argument1 === 'globalOverride2'
          ? 'Override Request from global middleware2'
          : result;
      };
      let argument2;
      let argument3;

      beforeEach(() => {
        argument2 = [];
        argument3 = [];
      });

      it('should override args in middleware | service middlewares', () => {
        // Add middlewares
        middlewareInstance.add('testService', middleware1, { name: 'middleware1', priority: 0 });
        middlewareInstance.add('testService', middleware2, { name: 'middleware2', priority: 0 });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctxTestService);

        // Run proxy
        const result = proxy.fetch('overrideArgs', argument2, argument3);

        // Check if the order of the middlewares is correct
        expect(argument2).toEqual([
          'middleware1 before',
          'middleware2 before',
          'middleware2 after',
          'middleware1 after',
        ]);

        // Check if the context is correct
        expect(argument3).toEqual([
          'Response of fetch method with args override',
          'Response of fetch method with args override',
        ]);

        // Check if the result is correct
        expect(argument3[0]).toBe(result);
        expect(argument3[1]).toBe(result);
      });

      it('should override response in middleware 1 - 2 | service and global middlewares', () => {
        // Add middlewares
        middlewareInstance.add('testService', middleware1, { name: 'middleware1', priority: 0 });
        middlewareInstance.add('testService', middleware2, { name: 'middleware2', priority: 0 });
        middlewareInstance.addGlobal(globalMiddleware1, { name: 'globalMiddleware2', priority: 0 });
        middlewareInstance.addGlobal(globalMiddleware2, { name: 'globalMiddleware2', priority: 0 });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctxTestService);

        // Run proxy with override middleware 1
        let result = proxy.fetch('override1', argument2, argument3);

        // Check if the order of the middlewares is correct
        expect(argument2).toEqual([
          'global middleware1 before',
          'global middleware2 before',
          'middleware1 before',
          'middleware2 before',
          'middleware2 after',
          'middleware1 after',
          'global middleware2 after',
          'global middleware1 after',
        ]);

        // Check if the context is correct
        expect(argument3).toEqual([
          'Response of fetch method with arg: override1',
          'Response of fetch method with arg: override1',
          'Override Request from middleware1',
          'Override Request from middleware1',
        ]);

        // Check if the result is correct
        expect(result).toBe('Override Request from middleware1');

        // Run proxy with override middleware 2
        argument2 = [];
        argument3 = [];
        result = proxy.fetch('override2', argument2, argument3);

        // Check if the order of the middlewares is correct
        expect(argument2).toEqual([
          'global middleware1 before',
          'global middleware2 before',
          'middleware1 before',
          'middleware2 before',
          'middleware2 after',
          'middleware1 after',
          'global middleware2 after',
          'global middleware1 after',
        ]);

        // Check if the context is correct
        expect(argument3).toEqual([
          'Response of fetch method with arg: override2',
          'Override Request from middleware2',
          'Override Request from middleware2',
          'Override Request from middleware2',
        ]);

        // Check if the result is correct
        expect(result).toBe('Override Request from middleware2');
      });

      it('should override response in global middleware 1 - 2 | service and global middlewares', () => {
        // Add middlewares
        middlewareInstance.add('testService', middleware1, { name: 'middleware1', priority: 0 });
        middlewareInstance.add('testService', middleware2, { name: 'middleware2', priority: 0 });
        middlewareInstance.addGlobal(globalMiddleware1, { name: 'globalMiddleware2', priority: 0 });
        middlewareInstance.addGlobal(globalMiddleware2, { name: 'globalMiddleware2', priority: 0 });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctxTestService);

        // Run proxy with override middleware 1
        let result = proxy.fetch('globalOverride1', argument2, argument3);

        // Check if the order of the middlewares is correct
        expect(argument2).toEqual([
          'global middleware1 before',
          'global middleware2 before',
          'middleware1 before',
          'middleware2 before',
          'middleware2 after',
          'middleware1 after',
          'global middleware2 after',
          'global middleware1 after',
        ]);

        // Check if the context is correct
        expect(argument3).toEqual([
          'Response of fetch method with arg: globalOverride1',
          'Response of fetch method with arg: globalOverride1',
          'Response of fetch method with arg: globalOverride1',
          'Response of fetch method with arg: globalOverride1',
        ]);

        // Check if the result is correct
        expect(result).toBe('Override Request from global middleware1');

        // Run proxy with override middleware 2
        argument2 = [];
        argument3 = [];
        result = proxy.fetch('globalOverride2', argument2, argument3);

        // Check if the order of the middlewares is correct
        expect(argument2).toEqual([
          'global middleware1 before',
          'global middleware2 before',
          'middleware1 before',
          'middleware2 before',
          'middleware2 after',
          'middleware1 after',
          'global middleware2 after',
          'global middleware1 after',
        ]);

        // Check if the context is correct
        expect(argument3).toEqual([
          'Response of fetch method with arg: globalOverride2',
          'Response of fetch method with arg: globalOverride2',
          'Response of fetch method with arg: globalOverride2',
          'Override Request from global middleware2',
        ]);

        // Check if the result is correct
        expect(result).toBe('Override Request from global middleware2');
      });
    });

    describe('Override requests in middleware using the container', () => {
      const middleware = (next, context, args) => {
        const [argument] = args;
        const { arg1, arg2 } = argument;
        const { container } = context;
        const containerService = container.get('containerService');
        const containerResult = containerService.fetch(arg2);
        const result = next([arg1]);
        argument.containerResult = containerResult;
        argument.originalResult = result;
        return containerResult;
      };
      const middlewareInfiniteLoop = (next, context) => {
        const { container } = context;
        const testService = container.get('testService');
        return testService.fetch();
      };
      const middlewareOmitInfiniteLoop = (next, context) => {
        const { container } = context;
        const testService = container.get('testService', { proxyMiddleware: false });
        return testService.fetch();
      };
      let argument;

      beforeEach(() => {
        argument = {};
      });

      it('should override result with a service middleware | container service', () => {
        // Add middlewares
        middlewareInstance.add('testService', middleware, { name: 'middleware', priority: 0 });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctxTestService);

        // Run proxy
        argument.arg1 = 'param1';
        let result = proxy.fetch(argument);

        // Check if the result is correct
        expect(result).toBe(argument.containerResult);
        expect(argument).toEqual({
          arg1: 'param1',
          containerResult: 'Response of containerService without args',
          originalResult: 'Response of fetch method with arg: param1',
        });

        // Run proxy with container argument
        argument.arg2 = 'param2';
        result = proxy.fetch(argument);

        expect(result).toBe(argument.containerResult);
        expect(argument).toEqual({
          arg1: 'param1',
          containerResult: 'Response of containerService with args: param2',
          originalResult: 'Response of fetch method with arg: param1',
          arg2: 'param2',
        });
      });

      it('should override result with a global middleware | container service', () => {
        // Add middlewares
        middlewareInstance.addGlobal(middleware, { name: 'globalMiddleware', priority: 0 });

        // Get proxy
        const proxy = middlewareInstance.getProxy(ctxTestService);

        // Run proxy
        argument.arg1 = 'param1';
        let result = proxy.fetch(argument);

        // Check if the result is correct
        expect(result).toBe(argument.containerResult);
        expect(argument).toEqual({
          arg1: 'param1',
          containerResult: 'Response of containerService without args',
          originalResult: 'Response of fetch method with arg: param1',
        });

        // Run proxy with container argument
        argument.arg2 = 'param2';
        result = proxy.fetch(argument);

        expect(result).toBe(argument.containerResult);
        expect(argument).toEqual({
          arg1: 'param1',
          containerResult: 'Response of containerService with args: param2',
          originalResult: 'Response of fetch method with arg: param1',
          arg2: 'param2',
        });
      });

      it('should get a "Maximum call stack size exceeded" when call a method | service middleware | infinite loop', () => {
        // Add middlewares
        container.middleware.add('testService', middlewareInfiniteLoop);

        // Get proxy
        const proxy = container.get('testService');

        // Should get a maximum call stack error
        expect(() => proxy.fetch(argument)).toThrowError('Maximum call stack size exceeded');
      });

      it('should get a "Maximum call stack size exceeded" when call a method | global middleware | infinite loop', () => {
        // Add middlewares
        container.middleware.addGlobal(middlewareInfiniteLoop);

        // Get proxy
        const proxy = container.get('testService');

        // Should get a maximum call stack error
        expect(() => proxy.fetch(argument)).toThrowError('Maximum call stack size exceeded');
      });

      it('should omit the error "Maximum call stack size exceeded" when call a method | service middleware | infinite loop', () => {
        // Add middlewares
        container.middleware.add('testService', middlewareOmitInfiniteLoop);

        // Get proxy
        const proxy = container.get('testService');

        // Should dont get a maximum call stack error
        expect(() => proxy.fetch(argument)).not.toThrowError('Maximum call stack size exceeded');
      });

      it('should omit the error "Maximum call stack size exceeded" when call a method | global middleware | infinite loop', () => {
        // Add middlewares
        container.middleware.addGlobal(middlewareOmitInfiniteLoop);

        // Get proxy
        const proxy = container.get('testService');

        // Should dont get a maximum call stack error
        expect(() => proxy.fetch(argument)).not.toThrowError('Maximum call stack size exceeded');
      });
    });

    describe('Cache middleware', () => {
      it('should get a memoized result', () => {
        const overrideCtx = {
          ...ctxTestService,
          options: { cache: true },
        };

        // Get proxy
        const proxy = middlewareInstance.getProxy(overrideCtx);

        // Run proxy
        const result1 = proxy.getUniqid();
        const result2 = proxy.getUniqid();

        // Check if the result is correct
        expect(result1).toBe(result2);

        // Check cache storage
        const entries = [...middlewareInstance.cache.storage.entries()];
        expect(middlewareInstance.cache.storage.size).toBe(1);
        expect(entries[0][0]).toBe('testService_getUniqid_[]');
        expect(entries[0][1]).toBe(result1);
        expect(entries[0][1]).toBe(result2);
      });

      it('should get a memoized result with deprecated cached option', () => {
        const overrideCtx = {
          ...ctxTestService,
          options: { cached: true },
        };

        // Get proxy
        const proxy = middlewareInstance.getProxy(overrideCtx);

        // Run proxy
        const result1 = proxy.getUniqid();
        const result2 = proxy.getUniqid();

        // Check if the result is correct
        expect(result1).toBe(result2);

        // Check cache storage
        const entries = [...middlewareInstance.cache.storage.entries()];
        expect(middlewareInstance.cache.storage.size).toBe(1);
        expect(entries[0][0]).toBe('testService_getUniqid_[]');
        expect(entries[0][1]).toBe(result1);
        expect(entries[0][1]).toBe(result2);
      });
    });
  });
};
