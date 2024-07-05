import uniqid from 'uniqid';
import each from 'jest-each';

export const cacheCommonTests = (Cache) => {
  describe('Testing Cache Common Tests', () => {
    let cache;
    const mockFunction = jest.fn();
    const ctxCacheFunctions = {
      key: 'testKey',
      callback: mockFunction,
      instance: null,
      config: {
        cached: true,
        methods: [ 'method1' ],
      },
    };
    const ctxCacheObjects = {
      key: 'testKeyClasses',
      callback: mockFunction,
      instance: null,
      config: {
        cached: true,
        methods: [ 'getTime' ],
      },
    };
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
      };
      ctxCacheObjects.instance = new TestingClass();
    });

    describe("Cache Functions", () => {
      it("Memorize the methods configured on the given context object", () => {
        const ctxOut = cache.memorizeMethods(ctxCacheFunctions);
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
          config: {
            cached: true,
          },
        };
        const ctxOut = cache.memorizeMethods(overrideCtx);
        const uniqid1 = ctxOut.instance.method1();
        const uniqid2 = ctxOut.instance.method2();

        // 'Should cache all methods
        expect(cache['methods'].size).toBe(2);
        expect(Array.from(cache['methods'])[0]).toEqual([ 'testKey_method1_[]', uniqid1 ]);
        expect(Array.from(cache['methods'])[1]).toEqual([ 'testKey_method2_[]', uniqid2 ]);
      });

      it('Should not cache any methods if not config is set', () => {
        const overrideCtx = {
          ...ctxCacheFunctions,
          config: undefined,
        };
        const ctxOut = cache.memorizeMethods(overrideCtx);

        ctxOut.instance.method1();
        ctxOut.instance.method2();

        // Any method should be memorized
        expect(cache['methods'].size).toBe(0);
      });

      it("Only methods from config are extracted from the keys of the function instance", () => {
        const methods = cache['extractMethods'](ctxCacheFunctions);
        expect(methods).toEqual([ "method1" ]);
      });
    });

    describe("Cache Objects", () => {
      it("Memorize the methods configured on the given context object", () => {
        const ctxOut = cache.memorizeMethods(ctxCacheObjects);
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
          config: {
            cached: true,
          },
        };
        const ctxOut = cache.memorizeMethods(overrideCtx);
        ctxOut.instance.getTime();
        ctxOut.instance.getDay();

        // Should cache all methods
        expect(cache['methods'].size).toBe(2);
        expect(Array.from(cache['methods'])[0]).toEqual([ 'testKeyClasses_getTime_[]', 1720107080000 ]);
        expect(Array.from(cache['methods'])[1]).toEqual([ 'testKeyClasses_getDay_[]', 4 ]);
      });

      it('Should not cache any methods if not config is set', () => {
        const overrideCtx = {
          ...ctxCacheObjects,
          config: undefined,
        };
        const ctxOut = cache.memorizeMethods(overrideCtx);

        ctxOut.instance.getTime();
        ctxOut.instance.getDay();

        // Any method should be memorized
        expect(cache['methods'].size).toBe(0);
      });

      it("Only methods from config are extracted from the prototype of the instance", () => {
        const methods = cache['extractMethods'](ctxCacheObjects);
        expect(methods).toEqual([ "getTime" ]);
      });
    });

    describe("Common functions", () => {
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
