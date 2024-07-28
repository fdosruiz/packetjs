const commonSandboxTests = (container, cicd = false) => {
  // Add properties
  container.addProps({
      date: '2022-03-18T17:00:03.030Z',
      url: 'http://example.com',
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
      return {
        getRandom1,
        getRandom2,
        doTimeout,
      }
    };
    container.add('Date', ({ container: c }) => {
      return new Date();
    }, { cached: true });
    container.add('Date2', ({ container: c }) => {
      return new Date();
    }, { cached: true, methods: ['getTime'] });
    container.add('Random', ({ container: c }) => {
      return functionService();
    }, { cached: true, methods: ['getRandom1', 'getRandom2', 'doTimeout'] });
    container.add('RandomExclude', ({ container: c }) => {
      return functionService();
    }, { cached: true, methods: ['getRandom1'], excludeMode: true });
  };

  const addNewProps = () => {
    console.log('--------------------------- BEFORE ADD NEW PROPS ------------------------------------');
    console.log(container.getProps());
    container.addProps({
        url: 'http://override.url.com',
        url2: 'http://example2.com',
        user: 'Francisco',
    });
    console.log('--------------------------- AFTER ADD NEW PROPS ------------------------------------');
    console.log(container.getProps());
  };

  const gettingServices = () => {
    // Get service 5
    console.log('--------------------------- BEFORE CALLING SERVICE 5 ------------------------------------');
    console.log(container.context.get('Service5'));
    const service5_1 = container.getFactory('Service5');
    const service5_2 = container.getFactory('Service5');
    console.log('--------------------------- AFTER CALLING SERVICE 5 WITH FACTORY ------------------------------------');
    console.log(container.context.get('Service5'));
    console.log(' >> With factory service5_1 and service5_2 should be different:', service5_1, service5_2, service5_1 === service5_2); // false
    const service5_3 = container.get('Service5');
    const service5_4 = container.get('Service5');
    console.log('--------------------------- AFTER CALLING SERVICE 5 WITH GET ------------------------------------');
    console.log(container.context.get('Service5'));
    console.log(' >> With get service5_3 and service5_4 should be the same:', service5_3, service5_4, service5_3 === service5_4); // true

    // Get service 4
    console.log('--------------------------- BEFORE CALLING SERVICE 4 (LAZY) ------------------------------------');
    console.log('Service 2:', container.context.get('Service2'));
    console.log('Service 3:', container.context.get('Service3'));
    console.log('Service 4:', container.context.get('Service4'));
    container.get('Service4');
    console.log('--------------------------- AFTER CALLING SERVICE 4 (LAZY) ------------------------------------');
    console.log('Service 2:', container.context.get('Service2'));
    console.log('Service 3:', container.context.get('Service3'));
    console.log('Service 4:', container.context.get('Service4'));
  };

  const gettingAllServices = () => {
    console.log('--------------------------- BEFORE CALLING ALL SERVICES (6 and 7) ------------------------------------');
    console.log(container.context.get('Service6'));
    console.log(container.context.get('Service7'));
    console.log('--------------------------- AFTER CALLING ALL SERVICES (6 and 7) ------------------------------------');
    const {
      Service6,
      Service7,
    } = container.getAll();
    console.log(' >> Callback functions: ', Service6, Service7);
    Service6();
    Service7();
    console.log(container.context.get('Service6'));
    console.log(container.context.get('Service7'));
  };


  const memorizedServices = () => {
    console.log('--------------------------- BEFORE CALLING - MEMORIZE ALL METHODS (DATE) ------------------------------------');
    console.log(container.context.get('Date'));
    console.log(container.middleware.cache);

    console.log('--------------------------- AFTER CALLING - MEMORIZE ALL METHODS (DATE) ------------------------------------');
    container.get('Date').getTime('aaaa', '1111');
    console.log(container.context.get('Date'));
    console.log(container.middleware.cache);

    console.log('--------------------------- AFTER RECURSIVE CALLS - OVER SAME METHOD AND PROPS (DATE) ------------------------------------');
    container.get('Date').getTime('aaaa', '1111');
    container.get('Date').getTime('aaaa', '1111');
    container.get('Date').getTime('aaaa', '1111');
    container.get('Date').getTime('aaaa', '1111');
    container.get('Date').getTime('aaaa', '1111');
    console.log(container.middleware.cache.storage);

    console.log('--------------------------- AFTER RECURSIVE CALLS - OVER SAME METHOD AND DIFFERENT PROPS (DATE) ------------------------------------');
    container.get('Date').getTime('bbbb', '2222');
    container.get('Date').getTime('cccc', '3333');
    console.log(container.middleware.cache.storage);

    console.log('--------------------------- BEFORE CALLING - MEMORIZE CONFIG METHODS (DATE_2) ------------------------------------');
    console.log(container.context.get('Date2'));
    console.log(container.middleware.cache.storage);

    console.log('--------------------------- AFTER CALLING - MEMORIZE CONFIG METHODS (DATE_2) ------------------------------------');
    container.get('Date2').getTime('aaaa', '1111');
    console.log(container.context.get('Date2'));
    console.log(container.middleware.cache.storage);

    console.log('--------------------------- BEFORE CALLING - MEMORIZE CONFIG METHODS (RAMDOM) ------------------------------------');
    console.log(container.context.get('Random'));
    console.log(container.middleware.cache.storage);

    console.log('--------------------------- AFTER CALLING - MEMORIZE CONFIG METHODS (RAMDOM) ------------------------------------');
    const random1 = container.get('Random').getRandom1();
    const random2 = container.get('Random').getRandom1();
    console.log(' >> Random 1 and Random 2 should be equals:', random1, random2, random1 === random2); // true
    const random3 = container.get('Random').getRandom2();
    const random4 = container.get('Random').getRandom2();
    console.log(' >> Random 3 and Random 4 should be equals:', random3, random4, random3 === random4); // true
    console.log(container.context.get('Random'));
    console.log(container.middleware.cache.storage);

    console.log('--------------------------- AFTER CALLING - MEMORIZE CONFIG METHODS WITH DIFFERENT PROPS (RAMDOM) ------------------------------------');
    const random5 = container.get('Random').getRandom1();
    const random6 = container.get('Random').getRandom1('prop1', 'prop2');
    console.log(' >> Random 5 and Random 6 should be different:', random5, random6, random5 === random6); // false
    console.log(container.context.get('Random'));
    console.log(container.middleware.cache.storage);
  };

  const memorizedServicesExcludeMode = () => {
    console.log('--------------------------- BEFORE CALLING - MEMORIZE ALL METHODS EXCEPT EXCLUDED (RandomExclude) ------------------------------------');
    console.log(container.context.get('RandomExclude'));
    console.log(container.middleware.cache.storage);

    console.log('--------------------------- AFTER CALLING - MEMORIZE ALL METHODS EXCEPT EXCLUDED (RandomExclude) ------------------------------------');
    container.get('RandomExclude').getRandom1();
    container.get('RandomExclude').getRandom2();
    console.log(container.context.get('RandomExclude'));
    console.log(container.middleware.cache.storage);

    console.log('--------------------------- AFTER CALLING - MEMORIZE ALL METHODS EXCEPT EXCLUDED (RandomExclude with Factory Method) ------------------------------------');
    const factory = container.getFactory('RandomExclude');
    console.log(` >> Memoized getRandom1 (Factory): ${factory.getRandom1()}`);
    console.log(` >> Memoized getRandom1 (Factory): ${factory.getRandom1()}`);
    console.log(` >> Memoized getRandom1 (Factory): ${factory.getRandom1()}`);
    console.log(` >> Not Memoized getRandom2 (Factory): ${factory.getRandom2()}`);
    console.log(` >> Not Memoized getRandom2 (Factory): ${factory.getRandom2()}`);
    console.log(` >> Not Memoized getRandom2 (Factory): ${factory.getRandom2()}`);
    console.log(container.middleware.cache.storage);
  };

  const middlewares = () => {
    console.log('--------------------------- BEFORE CALLING - MIDDLEWARES ------------------------------------');
    // console.log(container);

    container.middleware.add('Service1',  (next, context, args) => {
      console.log('Service1 Middleware 1 before');
      const result = next(args);
      console.log('Service1 Middleware 1 after', result);
      return result;
    }, {
      priority: 1,
      name: 'Service1 Middleware 1',
    });

    container.middleware.add('Service1',  (next, context, args) => {
      console.log('Service1 Middleware 2 before', context);
      const result = next(args);
      console.log('Service1 Middleware 2 after', result);
      return result;
    }, {
      priority: 3,
      name: 'Service1 Middleware 2',
    });

    // container.middleware.add('Random',  async (next, context, args) => {
    //   const time = new Date().getTime();
    //   console.log('Random Middleware 1 before', context);
    //   // return 'Esto está cacheado';
    //   const result = await next(args);
    //   console.log('------>', result);
    //   const time2 = new Date().getTime();
    //   console.log('Random Middleware 1 after', result, args, next, time2 - time);
    //   // return 'Esto está NO cacheado';
    //   return result;
    // }, {
    //   priority: 1,
    //   name: 'Random Middleware 1',
    // });

    container.middleware.add('Random', (next, context, args) => {
      const time = new Date().getTime();
      console.log('Random Middleware 1 before');
      // const services = context.container.getAll();
      // console.log(services);
      // console.log(context.container.get('RandomExclude', true).getRandom2(), '-<------------------------------');
      // console.log(context.container.get('RandomExclude', true).getRandom2(), '-<------------------------------');
      // console.log(services.Random().getRandom1()); // IMPORTANTE DOCUMENTAR RangeError: Maximum
      // call stack size exceeded (middleware Random -> llama a Random bucle infinito)
      // return services.RandomExclude().getRandom2();
      const result = next(args);
      // console.log('------>', result);
      const time2 = new Date().getTime();
      // console.log('Random Middleware 1 after', result, args, time2 - time);
      return result;
    }, {
      priority: 0,
      name: 'Random Middleware 1',
    });
    container.middleware.add('Random', (next, context, args) => {
      const time = new Date().getTime();
      console.log('Random Middleware 2 before');
      // const services = context.container.getAll();
      // console.log(services);
      // console.log(context.container.get('RandomExclude', true).getRandom2(), '-<------------------------------');
      // console.log(context.container.get('RandomExclude', true).getRandom2(), '-<------------------------------');
      // console.log(services.Random().getRandom1()); // IMPORTANTE DOCUMENTAR RangeError: Maximum
      // call stack size exceeded (middleware Random -> llama a Random bucle infinito)
      // return services.RandomExclude().getRandom2();
      const result = next(args);
      // console.log('------>', result);
      const time2 = new Date().getTime();
      // console.log('Random Middleware 1 after', result, args, time2 - time);
      return result;
    }, {
      priority: 0,
      name: 'Random Middleware 2',
    });

    // Global Middleware
    // container.middleware.addGlobal(  (next, context, args) => {
    //   const time = new Date().getTime();
    //   console.log('Global Middleware 1 before', context);
    //   // const services = context.container.getAll();
    //   // console.log(args);
    //   // console.log(services.Random().getRandom2()); // IMPORTANTE DOCUMENTAR RangeError: Maximum
    //   // console.log(services.Service1().getTime()); // IMPORTANTE DOCUMENTAR RangeError: Maximum
    //   // call stack size exceeded (middleware Random -> llama a Random bucle infinito)
    //   // return services.RandomExclude().getRandom2();
    //   const result = next(args);
    //   console.log('------>', result);
    //   const time2 = new Date().getTime();
    //   console.log('Global Middleware 1 after', result, args, next, time2 - time);
    //   return result;
    // }, {
    //   priority: 2,
    //   name: 'Global Middleware 1',
    // });

    // Global Middleware
    // container.middleware.addGlobal(  (next, context, args) => {
    //   const time = new Date().getTime();
    //   console.log('Global Middleware 2 before', context);
    //   const services = context.container.getAll(false);
    //   console.log(services);
    //   console.log(services.Random().getRandom2()); // IMPORTANTE DOCUMENTAR RangeError: Maximum
    //   // call stack size exceeded (middleware Random -> llama a Random bucle infinito)
    //   // return services.RandomExclude().getRandom2();
    //   const result = next(args);
    //   console.log('------>', result);
    //   const time2 = new Date().getTime();
    //   console.log('Global Middleware 2 after', result, args, next, time2 - time);
    //   return result;
    // }, {
    //   priority: 3,
    //   name: 'Global Middleware 2',
    // });

    // console.log(container.get('Service1').getTime());
    // console.log(container.get('Random').getRandom1(), 'Resultado Final');
    // console.log(container.get('Random').getRandom1(), 'Resultado');
    const factory1 = container.getFactory('Random');
    console.log(factory1.getRandom1('abc', true, 1, 2, 3, 4));

    container.add('Request', () => 'Response of service Request');

    container.middleware.add('Request',  (next, context, args) => {
      console.log('Service1 Middleware 1 before');
      const result = next(args);
      console.log('Service1 Middleware 1 after', result);
      return result;
    }, {
      priority: 0,
      name: 'Request Middleware 1',
    });
    console.log(container.get('Request'));
    // console.log(factory1.getRandom1('abc', true, 1, 2, 3, 4));
    // console.log(factory1.getRandom1());
    // console.log(factory1.getRandom1());
    // console.log(factory1.getRandom1());
    // console.log(factory1.getRandom1());
    // console.log(container.getFactory('Random').getRandom1());
    // console.log(container);
    // console.log(container.getFactory('Random').getRandom1());
    // console.log(container.getFactory('Random').getRandom1());
    // console.log(container.getFactory('Random').getRandom1());
    // console.log(container.middleware.middlewaresStack);
    // console.log('comienza el 1 timeout');
    // container.get('Random').doTimeout(10000).then((result) => console.log(result));
    //
    // setTimeout(() => {
    //   console.log('comienza el 2 timeout');
    //   container.get('Random').doTimeout(10000).then((result) => console.log(result));
    //   // console.log(container);
    // }, 10000);

    // console.log(container.get('Random').getRandom1());
    // console.log(container.get('Random').getRandom1());
    // console.log(container.get('Random').getRandom1());
    // console.log(container);

    // client.middlewareStack.add((next, context) => (args) => next(args));

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


