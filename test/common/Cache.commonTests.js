import uniqid from 'uniqid';
import each from 'jest-each';

export const cacheCommonTests = (Cache) => {
  describe('Testing Cache Common Tests', () => {
    let cache;
    const mockFunction = jest.fn();
    const ctxCacheFunctions = { key: 'testKey', callback: mockFunction, instance: null };
    const ctxCacheObjects = { key: 'testKeyClasses', callback: mockFunction, instance: null };
    const time = 1720107080000;
    const getTimeMock = jest.fn(() => new Date(time).getTime());
    const getDayMock = jest.fn(() => new Date(time).getDay());
    const TestingClass = class Testing {
      getTime = getTimeMock;
      getDay = getDayMock;
    };

    beforeEach(() => {
      cache = new Cache();
      ctxCacheFunctions.instance = {
        method1: jest.fn(() => uniqid()),
        method2: jest.fn(() => uniqid()),
        method3: jest.fn(() => uniqid()),
        method4: jest.fn(() => uniqid()),
        method5: jest.fn(() => uniqid()),
      };
      ctxCacheObjects.instance = new TestingClass();
    });

    describe("Cache Functions", () => {
      it("Memorize the methods configured on the given context object", () => {
        const overrideCtx = {
          ...ctxCacheFunctions,
          options: { cached: true, methods: [ 'method1' ] },
        };
        const ctxOut = cache.memorizeMethods(overrideCtx);
        // Call the method1
        const uniqid1 = ctxOut.instance.method1();
        const uniqid2 = ctxOut.instance.method1();
        const uniqid3 = ctxOut.instance.method1();

        // Uniqid should be the same
        expect(uniqid1).toEqual(uniqid2);
        expect(uniqid2).toEqual(uniqid3);

        // Original method1 should be called once
        expect(ctxOut.instance.method1).toHaveBeenCalledTimes(1);

        // Call the method2
        const uniqid4 = ctxOut.instance.method2();
        const uniqid5 = ctxOut.instance.method2();
        const uniqid6 = ctxOut.instance.method2();

        // Uniqid should be different
        expect(uniqid4).not.toEqual(uniqid5);
        expect(uniqid5).not.toEqual(uniqid6);
        expect(uniqid6).not.toEqual(uniqid4);

        // Original method2 should be called three times
        expect(ctxOut.instance.method2).toHaveBeenCalledTimes(3);

        // Only the method1 should be memorized
        expect(cache['methods'].size).toBe(1);
        expect(cache['methods'].keys().next().value).toBe('testKey_method1_[]'); // key_method_[props array]
        expect(cache['methods'].get('testKey_method1_[]')).toBe(uniqid1); // Cached value

        // Instance should be stored
        expect(cache['instances'].size).toBe(1);
        expect(cache['instances'].keys().next().value).toBe('testKey');
      });

      it('Should cache all methods if config methods is not set', () => {
        const overrideCtx = {
          ...ctxCacheFunctions,
          options: { cached: true },
        };
        const ctxOut = cache.memorizeMethods(overrideCtx);
        const uniqid1 = ctxOut.instance.method1();
        const uniqid2 = ctxOut.instance.method2();
        const uniqid3 = ctxOut.instance.method3();
        const uniqid4 = ctxOut.instance.method4();
        const uniqid5 = ctxOut.instance.method5();

        // 'Should cache all methods
        expect(cache['methods'].size).toBe(5);
        expect(Array.from(cache['methods'])[0]).toEqual([ 'testKey_method1_[]', uniqid1 ]);
        expect(Array.from(cache['methods'])[1]).toEqual([ 'testKey_method2_[]', uniqid2 ]);
        expect(Array.from(cache['methods'])[2]).toEqual([ 'testKey_method3_[]', uniqid3 ]);
        expect(Array.from(cache['methods'])[3]).toEqual([ 'testKey_method4_[]', uniqid4 ]);
        expect(Array.from(cache['methods'])[4]).toEqual([ 'testKey_method5_[]', uniqid5 ]);
      });

      it('Should cache all methods except methods excluded', () => {
        const overrideCtx = {
          ...ctxCacheFunctions,
          options: { cached: true, methods: [ 'method1' ], excludeMode: true },
        };
        const ctxOut = cache.memorizeMethods(overrideCtx);
        ctxOut.instance.method1();
        ctxOut.instance.method2();
        ctxOut.instance.method3();
        ctxOut.instance.method4();
        ctxOut.instance.method5();

        // 'Should cache all methods except method1
        expect(cache['methods'].size).toBe(4);
        expect(cache['methods'].get('testKey_method1_[]')).toBeUndefined();
        expect(cache['methods'].get('testKey_method2_[]')).not.toBeUndefined();
        expect(cache['methods'].get('testKey_method3_[]')).not.toBeUndefined();
        expect(cache['methods'].get('testKey_method4_[]')).not.toBeUndefined();
        expect(cache['methods'].get('testKey_method5_[]')).not.toBeUndefined();
      });

      it('Should not cache any methods if not config is set', () => {
        const overrideCtx = {
          ...ctxCacheFunctions,
          options: undefined,
        };
        const ctxOut = cache.memorizeMethods(overrideCtx);

        ctxOut.instance.method1();
        ctxOut.instance.method2();

        // Any method should be memorized
        expect(cache['methods'].size).toBe(0);
      });

      it("Only methods from config are extracted from the keys of the function instance", () => {
        const overrideCtx = {
          ...ctxCacheFunctions,
          options: { cached: true, methods: [ 'method1' ] },
        };
        const methods = cache['extractMethods'](overrideCtx);
        expect(methods).toEqual([ "method1" ]);
      });
    });

    describe("Cache Objects", () => {
      it("Memorize the methods configured on the given context object", () => {
        const overrideCtx = {
          ...ctxCacheObjects,
          options: { cached: true, methods: [ 'getTime' ] },
        };
        const ctxOut = cache.memorizeMethods(overrideCtx);
        // Call getTime three times
        ctxOut.instance.getTime();
        ctxOut.instance.getTime();
        expect(ctxOut.instance.getTime()).toBe(time);

        // Original getTime method should be called once
        expect(getTimeMock).toHaveBeenCalledTimes(1);

        // Call the method2
        ctxOut.instance.getDay();
        ctxOut.instance.getDay();
        expect(ctxOut.instance.getDay()).toBe(4);

        // Original getDay method should be called three times
        expect(getDayMock).toHaveBeenCalledTimes(3);

        // Only the getTime method should be memorized
        expect(cache['methods'].size).toBe(1);
        expect(cache['methods'].keys().next().value).toBe('testKeyClasses_getTime_[]'); // key_method_[props array]
        expect(cache['methods'].get('testKeyClasses_getTime_[]')).toBe(time); // Cached value

        // Instance should be stored
        expect(cache['instances'].size).toBe(1);
        expect(cache['instances'].keys().next().value).toBe('testKeyClasses');
      });

      it('Should cache all methods if config methods is not set', () => {
        const overrideCtx = {
          ...ctxCacheObjects,
          options: { cached: true },
        };
        const ctxOut = cache.memorizeMethods(overrideCtx);
        ctxOut.instance.getTime();
        ctxOut.instance.getDay();

        // Should cache all methods
        expect(cache['methods'].size).toBe(2);
        expect(Array.from(cache['methods'])[0]).toEqual([ 'testKeyClasses_getTime_[]', 1720107080000 ]);
        expect(Array.from(cache['methods'])[1]).toEqual([ 'testKeyClasses_getDay_[]', 4 ]);
      });

      it('Should cache all methods except methods excluded', () => {
        const overrideCtx = {
          ...ctxCacheObjects,
          options: { cached: true, methods: [ 'getTime' ], excludeMode: true },
        };
        const ctxOut = cache.memorizeMethods(overrideCtx);
        ctxOut.instance.getTime();
        ctxOut.instance.getDay();

        // 'Should cache all methods except getTime method
        expect(cache['methods'].size).toBe(1);
        expect(cache['methods'].get('testKeyClasses_getTime_[]')).toBeUndefined();
        expect(cache['methods'].get('testKeyClasses_getDay_[]')).not.toBeUndefined();
      });

      it('Should not cache any methods if not config is set', () => {
        const overrideCtx = {
          ...ctxCacheObjects,
          options: undefined,
        };
        const ctxOut = cache.memorizeMethods(overrideCtx);

        ctxOut.instance.getTime();
        ctxOut.instance.getDay();

        // Any method should be memorized
        expect(cache['methods'].size).toBe(0);
      });

      it("Only methods from config are extracted from the prototype of the instance", () => {
        const overrideCtx = {
          ...ctxCacheObjects,
          options: { cached: true, methods: [ 'getTime' ] },
        };
        const methods = cache['extractMethods'](overrideCtx);
        expect(methods).toEqual([ "getTime" ]);
      });
    });

    describe("Common functions", () => {
      it('Should cache only instances that dont have a previous cache key', () => {
        const overrideCtx = {
          ...ctxCacheFunctions,
          options: { cached: true },
        };

        // Cache testKey instance
        const ctxOut = cache.memorizeMethods(overrideCtx);

        const unique1 = ctxOut.instance.method1();
        const unique2 = ctxOut.instance.method1();

        // First instance should be cached
        expect(unique1).toBe(unique2);

        // Create another instance
        const anotherCtx = {
          key: 'testKey', // duplicate key
          instance: {
            method1: jest.fn(() => uniqid()),
          },
        };

        // Cache testKey instance (duplicated key)
        const ctxOut2 = cache.memorizeMethods(anotherCtx);

        const unique3 = ctxOut2.instance.method1();
        const unique4 = ctxOut2.instance.method1();

        // Second instance should not be cached
        expect(unique3).not.toBe(unique4);
      });

      each([
        [ true ],
        [ false ],
      ]).it("Object methods are extracted when object prototype is not equivalent to the instance's prototype", (prototypeStatus) => {
        if (prototypeStatus) {
          ctxCacheFunctions.instance.__proto__ = Object.prototype;
        }
        const methods = cache['getObjectMethods'](ctxCacheFunctions);
        expect(methods).toBeTruthy();
      });

      it("Creates a cache proxy for a given method", () => {
        let proxyHandler = cache['createCacheProxy'](ctxCacheFunctions, 'method1');
        expect(typeof proxyHandler).toEqual("function");
      });

      it("Cache key is generated for a given key, method and arguments array", () => {
        let cacheKey = cache['generateCacheKey']('ServiceName', 'methodName', ['arg1', 'arg2']);
        expect(cacheKey).toEqual('ServiceName_methodName_["arg1","arg2"]');
      });
    });
  });
};
