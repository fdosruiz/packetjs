import uniqid from 'uniqid';

export const cacheCommonTests = (Cache) => {
  describe('Common Unit Testing for Cache (lib + src)', () => {
    const next = () => `next result ${uniqid()}`;
    let cache;
    let middleware;
    let addMock;
    let args = [];

    beforeEach(() => {
      cache = new Cache();
      args = [];
      addMock = jest.fn((arg1, arg2) => args.push(arg1, arg2));
      const middlewareMock = jest.fn(() => {
        return { add: addMock };
      });
      middleware = middlewareMock();
    });

    it('should add a new cache middleware', () => {
      const ctx = { key: 'Service' };
      cache.add(ctx, middleware);
      expect(addMock).toHaveBeenCalled();
      expect(args[0]).toBe('Service');
      expect(args[1]).toEqual(expect.any(Function));
    });

    it('should cache the result of the middleware call', () => {
      const ctx = { key: 'Service2' };

      // Add cache middleware
      cache.add(ctx, middleware);

      // Before call middleware
      const [ key, callback ] = args;
      expect(addMock).toHaveBeenCalled();
      expect(key).toBe('Service2');
      expect(callback).toEqual(expect.any(Function));

      // Call middleware
      const result = callback(next, { methodName: 'method' }, [ 1, 2, 3 ]);

      // storage
      let storageEntries = [...cache.storage.entries()];
      expect(storageEntries[0][0]).toBe('Service2_method_[1,2,3]');
      expect(storageEntries[0][1]).toBe(result);

      // context
      const contextEntries = [...cache.context.entries()];
      expect(contextEntries[0][0]).toBe('Service2');
      expect(contextEntries[0][1]).toBe(ctx);

      // After call middleware again (get result from cache)
      const result2 = callback(next, { methodName: 'method' }, [ 1, 2, 3 ]);
      expect(result2).toBe(result);

      // storage
      storageEntries = [...cache.storage.entries()];
      expect(storageEntries[0][0]).toBe('Service2_method_[1,2,3]');
      expect(storageEntries[0][1]).toBe(result);
      expect(storageEntries[0][1]).toBe(result2);
    });

    it('should cache the result only for configured methods', () => {
      const ctx = { key: 'Service3', options: { cache: true, methods: [ 'method' ] } };

      // Add cache middleware
      cache.add(ctx, middleware);

      // Before call middleware
      const [ key, callback ] = args;
      expect(addMock).toHaveBeenCalled();
      expect(key).toBe('Service3');
      expect(callback).toEqual(expect.any(Function));

      // Call middleware
      const result = callback(next, { methodName: 'method' }, [ 1, 2, 3 ]);

      // storage
      let storageEntries = [...cache.storage.entries()];
      expect(storageEntries[0][0]).toBe('Service3_method_[1,2,3]');
      expect(storageEntries[0][1]).toBe(result);

      // Call middleware again (get the same result with methodName "method")
      const result2 = callback(next, { methodName: 'method' }, [ 1, 2, 3 ]);
      expect(result2).toBe(result);

      // storage
      storageEntries = [...cache.storage.entries()];
      expect(storageEntries[0][1]).toBe(result);
      expect(storageEntries[0][1]).toBe(result2);

      // Call middleware again with other method (should get other result, not the cached one)
      const result3 = callback(next, { methodName: 'otherMethod' }, [ 1, 2, 3 ]);
      expect(result3).not.toBe(result);

      // storage
      storageEntries = [...cache.storage.entries()];
      expect(storageEntries[0][1]).not.toBe(result3);
    });

    it('should cache the result only for not excluded methods', () => {
      const ctx = { key: 'Service4', options: { cache: true, methods: [ 'method' ], excludeMode: true } };

      // Add cache middleware
      cache.add(ctx, middleware);

      // Before call middleware
      const [ key, callback ] = args;
      expect(addMock).toHaveBeenCalled();
      expect(key).toBe('Service4');
      expect(callback).toEqual(expect.any(Function));

      // Call middleware with excluded method
      const result = callback(next, { methodName: 'method' }, [ 1, 2, 3 ]);

      // storage
      let storageEntries = [...cache.storage.entries()];
      expect(storageEntries).toHaveLength(0);

      // Call middleware again with excluded method (should get a new result)
      const result2 = callback(next, { methodName: 'method' }, [ 1, 2, 3 ]);
      expect(result2).not.toBe(result);

      // storage
      storageEntries = [...cache.storage.entries()];
      expect(storageEntries).toHaveLength(0);

      // Call middleware again with other method not exluded (should cache the result)
      const result3 = callback(next, { methodName: 'otherMethod' }, [ 1, 2, 3 ]);
      expect(result3).not.toBe(result);
      expect(result3).not.toBe(result2);

      // storage
      storageEntries = [...cache.storage.entries()];
      expect(storageEntries[0][0]).toBe('Service4_otherMethod_[1,2,3]');
      expect(storageEntries[0][1]).toBe(result3);
    });
  });
};
