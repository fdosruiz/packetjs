const uniqid = require('uniqid');

const commonSandboxTests = (container, cicd = false) => {
  const throwError = (msg) => {
    throw new Error(msg);
  };
  const toEquals = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };
  // Add properties
  container.addProps({
      date: '2022-03-18T17:00:03.030Z',
      url: 'https://example.com',
  });

  const addServices = () => {
    container.add('Service1', () => new Date());
    container.add('Service2', ({ props }) => new Date(props.date));
    !cicd
      ? container.add('Service3', ({ props }) => new URL(props.url))
      : container.add('Service3', ({ props }) => new Date(props.date))
    container.add('Service4', ({ container: c }) => {
        const service2 = c.get('Service2');
        const service3 = c.get('Service3');
        return new Date(service2);
    });
    container.add('Service5', () => Math.random() * 1000);
    container.add('Service6', ({ props }) => new Date(props.date));
    !cicd
      ? container.add('Service7', ({ props }) => new URL(props.url))
      : container.add('Service7', ({ props }) => new Date(props.date))
  };

  const addServicesForCaching = () => {
    const functionService = () => {
      const getRandom1 = () => Math.random() * 1000;
      const getRandom2 = () => Math.random() * 1000;
      const doTimeout = (time) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(`time lapsed: ${time}`), time);
        });
      };
      const getUniqid = () => uniqid();
      return {
        getRandom1,
        getRandom2,
        doTimeout,
        getUniqid,
      }
    };
    container.add('Date', ({ container: c }) => {
      return new Date();
    }, { cache: true });
    container.add('Date2', ({ container: c }) => {
      return new Date();
    }, { cache: true, methods: ['getTime'] });
    container.add('Random', ({ container: c }) => {
      return functionService();
    }, { cache: true, methods: ['getRandom1', 'getRandom2', 'doTimeout'] });
    container.add('RandomExclude', ({ container: c }) => {
      return functionService();
    }, { cache: true, methods: ['getRandom1'], excludeMode: true });
  };

  const addNewProps = () => {
    console.log('--------------------------- BEFORE ADD NEW PROPS ------------------------------------');
    console.log(container.getProps());
    container.addProps({
        url: 'https://override.url.com',
        url2: 'https://example2.com',
        user: 'Francisco',
    });
    console.log('--------------------------- AFTER ADD NEW PROPS ------------------------------------');
    console.log(container.getProps());

    if (cicd) {
      const expected = { date: '2022-03-18T17:00:03.030Z', url: 'https://override.url.com', url2: 'https://example2.com', user: 'Francisco' };
      if (!toEquals(container.getProps(), expected)) throwError("addNewProps | Props are not equals");
    }
  };

  const gettingServices = () => {
    // Get service 5
    console.log('--------------------------- BEFORE CALLING SERVICE 5 ------------------------------------');
    console.log(container.context.get('Service5'));
    const service5_1 = container.getFactory('Service5');
    const service5_2 = container.getFactory('Service5');
    const shouldBeDifferent = service5_1 === service5_2; // false
    console.log('--------------------------- AFTER CALLING SERVICE 5 WITH FACTORY ------------------------------------');
    console.log(container.context.get('Service5'));
    console.log(' >> With factory service5_1 and service5_2 should be different:', service5_1, service5_2, shouldBeDifferent); // false
    const service5_3 = container.get('Service5');
    const service5_4 = container.get('Service5');
    const shouldBeTheSame = service5_3 === service5_4; // true
    console.log('--------------------------- AFTER CALLING SERVICE 5 WITH GET ------------------------------------');
    console.log(container.context.get('Service5'));
    console.log(' >> With get service5_3 and service5_4 should be the same:', service5_3, service5_4, shouldBeTheSame); // true

    if (cicd) {
      if (shouldBeDifferent) throwError("gettingServices | service5_1 and service5_2 are the same");
      if (!shouldBeTheSame) throwError("gettingServices | service5_3 and service5_4 are not equals");
    }

    // Get service 4
    console.log('--------------------------- BEFORE CALLING SERVICE 4 (LAZY) ------------------------------------');
    const service2 = container.context.get('Service2');
    const service3 = container.context.get('Service3');
    const service4 = container.context.get('Service4');
    console.log('Service 2:', service2);
    console.log('Service 3:', service3);
    console.log('Service 4:', service4);

    if (cicd) {
      const isNull1 = service2.instance === null && service2.proxy === null;
      const isNull2 = service3.instance === null && service3.proxy === null;
      const isNull3 = service4.instance === null && service4.proxy === null;
      if (!isNull1) throwError("gettingServices | service2 should be null");
      if (!isNull2) throwError("gettingServices | service3 should be null");
      if (!isNull3) throwError("gettingServices | service4 should be null");
    }

    console.log('--------------------------- AFTER CALLING SERVICE 4 (LAZY) ------------------------------------');
    container.get('Service4');
    console.log('Service 2:', service2);
    console.log('Service 3:', service3);
    console.log('Service 4:', service4);

    if (cicd) {
      const isObject1 = typeof service2.instance === 'object' && typeof service2.proxy === 'object';
      const isObject2 = typeof service3.instance === 'object' && typeof service3.proxy === 'object';
      const isObject3 = typeof service4.instance === 'object' && typeof service4.proxy === 'object';
      if (!isObject1) throwError("gettingServices | service2 should be an object");
      if (!isObject2) throwError("gettingServices | service3 should be an object");
      if (!isObject3) throwError("gettingServices | service4 should be an object");
    }
  };

  const gettingAllServices = () => {
    console.log('--------------------------- BEFORE CALLING ALL SERVICES (6 and 7) ------------------------------------');
    const service6 = container.context.get('Service6');
    const service7 = container.context.get('Service7');
    console.log(service6);
    console.log(service7);

    if (cicd) {
      const isNull1 = service6.instance === null && service6.proxy === null;
      const isNull2 = service7.instance === null && service7.proxy === null;
      if (!isNull1) throwError("gettingServices | service6 should be null");
      if (!isNull2) throwError("gettingServices | service7 should be null");
    }

    console.log('--------------------------- AFTER CALLING ALL SERVICES (6 and 7) ------------------------------------');
    const {
      Service6,
      Service7,
    } = container.getAll();
    console.log(' >> Callback functions: ', Service6, Service7);
    Service6();
    Service7();
    console.log(service6);
    console.log(service7);

    if (cicd) {
      const isObject1 = typeof service6.instance === 'object' && typeof service6.proxy === 'object';
      const isObject2 = typeof service7.instance === 'object' && typeof service7.proxy === 'object';
      if (!isObject1) throwError("gettingServices | service6 should be an object");
      if (!isObject2) throwError("gettingServices | service7 should be an object");
    }
  };

  const memorizedServices = () => {
    console.log('--------------------------- BEFORE CALLING - MEMORIZE ALL METHODS (DATE) ------------------------------------');
    const serviceDate = container.context.get('Date');
    const cache = container.middleware.cache;
    const cacheStorage = cache.storage;
    console.log(serviceDate);
    console.log(cache);

    if (cicd) {
      const isEmpty = cacheStorage.size === 0 && cache.context.size === 0;
      if (!isEmpty) throwError("memorizedServices | BEFORE CALLING - MEMORIZE ALL METHODS | cache should be empty");
    }

    console.log('--------------------------- AFTER CALLING - MEMORIZE ALL METHODS (DATE) ------------------------------------');
    let result = container.get('Date').getTime('aaaa', '1111');
    console.log(' >> Result: ', result);
    console.log(serviceDate);
    console.log(cache);

    if (cicd) {
      const isNotEmpty = cacheStorage.size !== 0 && cache.context.size !== 0;
      const expected = [ [ 'Date_getTime_["aaaa","1111"]', result ] ];
      const storageEntries = [...cacheStorage.entries()];
      if (!isNotEmpty) throwError("memorizedServices | cache should not be empty");
      if (!toEquals(storageEntries, expected)) throwError("memorizedServices | AFTER CALLING - MEMORIZE ALL METHODS |cache storage are not equals");
    }

    console.log('--------------------------- AFTER RECURSIVE CALLS - OVER SAME METHOD AND PROPS (DATE) ------------------------------------');
    container.get('Date').getTime('aaaa', '1111');
    container.get('Date').getTime('aaaa', '1111');
    container.get('Date').getTime('aaaa', '1111');
    container.get('Date').getTime('aaaa', '1111');
    const result1 = container.get('Date').getTime('aaaa', '1111');
    console.log(cacheStorage);

    console.log('--------------------------- AFTER RECURSIVE CALLS - OVER SAME METHOD AND DIFFERENT PROPS (DATE) ------------------------------------');
    const result2 = container.get('Date').getTime('bbbb', '2222');
    const result3 = container.get('Date').getTime('cccc', '3333');
    console.log(cacheStorage);

    if (cicd) {
      const expected = [
        [ 'Date_getTime_["aaaa","1111"]', result1 ],
        [ 'Date_getTime_["bbbb","2222"]', result2 ],
        [ 'Date_getTime_["cccc","3333"]', result3 ]
      ];
      const storageEntries = [...cacheStorage.entries()];
      if (!toEquals(storageEntries, expected)) throwError("memorizedServices | AFTER RECURSIVE CALLS | cache storage are not equals");
    }

    console.log('--------------------------- BEFORE CALLING - MEMORIZE CONFIG METHODS (DATE_2) ------------------------------------');
    console.log(container.context.get('Date2'));
    console.log(cacheStorage);

    console.log('--------------------------- AFTER CALLING - MEMORIZE CONFIG METHODS (DATE_2) ------------------------------------');
    result = container.get('Date2').getTime('aaaa', '1111');
    console.log(container.context.get('Date2'));
    console.log(cacheStorage);

    if (cicd) {
      const expected = [
        [ 'Date_getTime_["aaaa","1111"]', result1 ],
        [ 'Date_getTime_["bbbb","2222"]', result2 ],
        [ 'Date_getTime_["cccc","3333"]', result3 ],
        [ 'Date2_getTime_["aaaa","1111"]', result ],
      ];
      const storageEntries = [...cacheStorage.entries()];
      if (!toEquals(storageEntries, expected)) throwError("memorizedServices | AFTER CALLING - MEMORIZE CONFIG METHODS | cache storage are not equals");
    }

    console.log('--------------------------- BEFORE CALLING - MEMORIZE CONFIG METHODS (RAMDOM) ------------------------------------');
    const randomService = container.context.get('Random');
    console.log(randomService);
    console.log(cacheStorage);

    if (cicd) {
      const expected = {
        key: 'Random',
        options: { cache: true, methods: ['getRandom1', 'getRandom2', 'doTimeout'] },
        instance: null,
        proxy: null,
      };
      if (!toEquals(randomService, expected)) throwError("memorizedServices | BEFORE CALLING - MEMORIZE CONFIG METHODS (RAMDOM) | object should be equals");
    }

    console.log('--------------------------- AFTER CALLING - MEMORIZE CONFIG METHODS (RAMDOM) ------------------------------------');
    const random1 = container.get('Random').getRandom1();
    const random2 = container.get('Random').getRandom1();
    const areEquals1 = random1 === random2;
    console.log(' >> Random 1 and Random 2 should be equals:', random1, random2, areEquals1); // true
    const random3 = container.get('Random').getRandom2();
    const random4 = container.get('Random').getRandom2();
    const areEquals2 = random1 === random2;
    console.log(' >> Random 3 and Random 4 should be equals:', random3, random4, areEquals2); // true
    console.log(randomService);
    console.log(cacheStorage);

    if (cicd) {
      const expected = [
        [ 'Date_getTime_["aaaa","1111"]', result1 ],
        [ 'Date_getTime_["bbbb","2222"]', result2 ],
        [ 'Date_getTime_["cccc","3333"]', result3 ],
        [ 'Date2_getTime_["aaaa","1111"]', result ],
        [ 'Random_getRandom1_[]', random1 ],
        [ 'Random_getRandom2_[]', random3 ],
      ];
      const storageEntries = [...cacheStorage.entries()];
      if (!areEquals1) throwError("memorizedServices | AFTER CALLING - MEMORIZE CONFIG METHODS (RAMDOM) | random1, random2 should be equals");
      if (!areEquals2) throwError("memorizedServices | AFTER CALLING - MEMORIZE CONFIG METHODS (RAMDOM) | random3, random4 should be equals");
      if (!toEquals(storageEntries, expected)) throwError("memorizedServices | AFTER CALLING - MEMORIZE CONFIG METHODS (RAMDOM) | cache storage are not equals");
    }

    console.log('--------------------------- AFTER CALLING - MEMORIZE CONFIG METHODS WITH DIFFERENT PROPS (RAMDOM) ------------------------------------');
    const random5 = container.get('Random').getRandom1();
    const random6 = container.get('Random').getRandom1('prop1', 'prop2');
    const areEquals3 = random5 === random6;
    console.log(' >> Random 5 and Random 6 should be different:', random5, random6, areEquals3); // false
    console.log(randomService);
    console.log(cacheStorage);

    if (cicd) {
      const expected = [
        [ 'Date_getTime_["aaaa","1111"]', result1 ],
        [ 'Date_getTime_["bbbb","2222"]', result2 ],
        [ 'Date_getTime_["cccc","3333"]', result3 ],
        [ 'Date2_getTime_["aaaa","1111"]', result ],
        [ 'Random_getRandom1_[]', random1 ],
        [ 'Random_getRandom2_[]', random3 ],
        [ 'Random_getRandom1_["prop1","prop2"]', random6 ],
      ];
      const storageEntries = [...cacheStorage.entries()];
      if (areEquals3) throwError("memorizedServices | AFTER CALLING - MEMORIZE CONFIG METHODS WITH DIFFERENT PROPS (RAMDOM) | random5, random6 should not be equals");
      if (!toEquals(storageEntries, expected)) throwError("memorizedServices | AFTER CALLING - MEMORIZE CONFIG METHODS (RAMDOM) | cache storage are not equals");
    }
  };

  const memorizedServicesExcludeMode = () => {
    console.log('--------------------------- BEFORE CALLING - MEMORIZE ALL METHODS EXCEPT EXCLUDED (RandomExclude) ------------------------------------');
    const serviceRandomExclude = container.context.get('RandomExclude');
    const cache = container.middleware.cache;
    const cacheStorage = cache.storage;
    console.log(serviceRandomExclude);
    console.log(cacheStorage);

    console.log('--------------------------- AFTER CALLING - MEMORIZE ALL METHODS EXCEPT EXCLUDED (RandomExclude) ------------------------------------');
    container.get('RandomExclude').getRandom1();
    container.get('RandomExclude').getRandom2();
    console.log(serviceRandomExclude);
    console.log(cacheStorage);

    console.log('--------------------------- AFTER CALLING - MEMORIZE ALL METHODS EXCEPT EXCLUDED (RandomExclude with Factory Method) ------------------------------------');
    const factory = container.getFactory('RandomExclude');
    console.log(` >> Memoized getRandom1 (Factory): ${factory.getRandom1()}`);
    console.log(` >> Memoized getRandom1 (Factory): ${factory.getRandom1()}`);
    console.log(` >> Memoized getRandom1 (Factory): ${factory.getRandom1()}`);
    console.log(` >> Not Memoized getRandom2 (Factory): ${factory.getRandom2()}`);
    console.log(` >> Not Memoized getRandom2 (Factory): ${factory.getRandom2()}`);
    console.log(` >> Not Memoized getRandom2 (Factory): ${factory.getRandom2()}`);
    console.log(cacheStorage);
  };

  const middlewares = () => {
    const middlewaresStack = container.middleware.middlewaresStack;
    middlewaresStack.clear();
    console.log('--------------------------- BEFORE CALLING - SERVICE MIDDLEWARES ------------------------------------');
    let result1 = [];
    let result2 = [];

    container.middleware.add('Random', (next, context, args) => {
      result1.push('Random Middleware 1 before');
      const result = next(args);
      result1.push('Random Middleware 1 after');
      result2.push(result);
      return result;
    }, {
      priority: 0,
      name: 'Random Middleware 1',
    });

    container.middleware.add('Random', (next, context, args) => {
      result1.push('Random Middleware 2 before');
      const result = next(args);
      result1.push('Random Middleware 2 after');
      result2.push(result);
      return result;
    }, {
      priority: 10,
      name: 'Random Middleware 2',
    });

    console.log(middlewaresStack);

    if (cicd) {
      const expected = [["Random",[{"global":false,"name":"Random Middleware 2","priority":10},{"global":false,"name":"Random Middleware 1","priority":0}]]];
      const storageEntries = [...middlewaresStack.entries()];
      if (!toEquals(storageEntries, expected)) throwError("memorizedServices | BEFORE CALLING - SERVICE MIDDLEWARES | middlewaresStack should be equals");
    }

    console.log('--------------------------- AFTER CALLING - SERVICE MIDDLEWARES ------------------------------------');
    const randomService = container.get('Random');
    const uniqid1 = randomService.getUniqid();
    console.log(' >> uniqid1:', uniqid1);
    console.log(result1);
    console.log(result2);

    if (cicd) {
      const expected = [
        'Random Middleware 2 before',
        'Random Middleware 1 before',
        'Random Middleware 1 after',
        'Random Middleware 2 after'
      ];
      if (!toEquals(result1, expected)) throwError("memorizedServices | AFTER CALLING - SERVICE MIDDLEWARES | order of middlewares should be equals");
      if (!toEquals(result2, [ uniqid1, uniqid1 ])) throwError("memorizedServices | AFTER CALLING - SERVICE MIDDLEWARES | results should be equals");
    }

    console.log('--------------------------- BEFORE CALLING - GLOBAL MIDDLEWARES ------------------------------------');
    result1 = [];
    result2 = [];

    // Force purge
    container.middleware.add('Random', (next, context, args) => {
      result1.push('Random Middleware 3 before');
      const result = next(args);
      result1.push('Random Middleware 3 after');
      result2.push(result);
      return result;
    }, {
      priority: 20,
      name: 'Random Middleware 3',
    });

    container.middleware.addGlobal((next, context, args) => {
      result1.push('Random Global Middleware 1 before');
      const result = next(args);
      result1.push('Random Global Middleware 1 after');
      result2.push(result);
      return result;
    }, {
      priority: 0,
      name: 'Random Global Middleware 1',
    });

    container.middleware.addGlobal((next, context, args) => {
      result1.push('Random Global Middleware 2 before');
      const result = next(args);
      result1.push('Random Global Middleware 2 after');
      result2.push(result);
      return result;
    }, {
      priority: 10,
      name: 'Random Global Middleware 2',
    });

    console.log(middlewaresStack);

    if (cicd) {
      const expected = [["Random",[{"global":false,"name":"Random Middleware 3","priority":20},{"global":false,"name":"Random Middleware 2",
        "priority":10},{"global":false,"name":"Random Middleware 1","priority":0}]],["global",[{"global":true,"name":"Random Global" +
          " Middleware 2","priority":10},{"global":true,"name":"Random Global Middleware 1","priority":0}]]];
      const storageEntries = [...middlewaresStack.entries()];
      if (!toEquals(storageEntries, expected)) throwError("memorizedServices | BEFORE CALLING - GLOBAL MIDDLEWARES | middlewaresStack should be equals");
    }

    console.log('--------------------------- AFTER CALLING - GLOBAL MIDDLEWARES ------------------------------------');
    const uniqid2 = container.get('Random').getUniqid();
    console.log(' >> uniqid2:', uniqid2);
    console.log(result1);
    console.log(result2);

    if (cicd) {
      const expected = [
        'Random Global Middleware 2 before',
        'Random Global Middleware 1 before',
        'Random Middleware 3 before',
        'Random Middleware 2 before',
        'Random Middleware 1 before',
        'Random Middleware 1 after',
        'Random Middleware 2 after',
        'Random Middleware 3 after',
        'Random Global Middleware 1 after',
        'Random Global Middleware 2 after',
      ];
      if (!toEquals(result1, expected)) throwError("memorizedServices | AFTER CALLING - GLOBAL MIDDLEWARES | order of middlewares should be equals");
      if (!toEquals(result2, [ uniqid2, uniqid2, uniqid2, uniqid2, uniqid2 ])) throwError("memorizedServices | AFTER CALLING - GLOBAL MIDDLEWARES | results should be equals");
    }
  };

  addServices();
  addServicesForCaching();
  addNewProps();
  gettingServices();
  gettingAllServices();
  memorizedServices();
  memorizedServicesExcludeMode();
  middlewares();
};

module.exports = {
  commonSandboxTests
};


