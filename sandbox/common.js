const commonSandboxTests = (container) => {
  // Add properties
  container.addProps({
      date: '2022-03-18T17:00:03.030Z',
      url: 'http://example.com',
  });

  const addServices = () => {
    container.add('Service1', () => new Date());
    container.add('Service2', ({ props }) => new Date(props.date));
    container.add('Service3', ({ props }) => new URL(props.url));
    container.add('Service4', ({ container: c }) => {
        const service2 = c.get('Service2');
        const service3 = c.get('Service3');
        return new Date(service2);
    });
    container.add('Service5', () => Math.random() * 1000);
    container.add('Service6', ({ props }) => new Date(props.date));
    container.add('Service7', ({ props }) => new URL(props.url));
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

  const addServicesForCaching = () => {
    const functionService = () => {
      const getRandom1 = () => Math.random() * 1000;
      const getRandom2 = () => Math.random() * 1000;
      return {
        getRandom1,
        getRandom2,
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
    }, { cached: true, methods: ['getRandom1', 'getRandom2'] });
    container.add('RandomExclude', ({ container: c }) => {
      return functionService();
    }, { cached: true, methods: ['getRandom2'], excludeMode: true });
  };

  const memorizedServices = () => {
    console.log('--------------------------- BEFORE CALLING - MEMORIZE ALL METHODS (DATE) ------------------------------------');
    console.log(container.context.get('Date'));
    console.log(container.cache);

    console.log('--------------------------- AFTER CALLING - MEMORIZE ALL METHODS (DATE) ------------------------------------');
    container.get('Date').getTime('aaaa', '1111');
    console.log(container.context.get('Date'));
    console.log(container.cache);

    console.log('--------------------------- AFTER RECURSIVE CALLS - OVER SAME METHOD AND PROPS (DATE) ------------------------------------');
    container.get('Date').getTime('aaaa', '1111');
    container.get('Date').getTime('aaaa', '1111');
    container.get('Date').getTime('aaaa', '1111');
    container.get('Date').getTime('aaaa', '1111');
    container.get('Date').getTime('aaaa', '1111');
    console.log(container.cache.methods);

    console.log('--------------------------- AFTER RECURSIVE CALLS - OVER SAME METHOD AND DIFFERENT PROPS (DATE) ------------------------------------');
    container.get('Date').getTime('bbbb', '2222');
    container.get('Date').getTime('cccc', '3333');
    console.log(container.cache.methods);

    console.log('--------------------------- BEFORE CALLING - MEMORIZE CONFIG METHODS (DATE_2) ------------------------------------');
    console.log(container.context.get('Date2'));
    console.log(container.cache.methods);

    console.log('--------------------------- AFTER CALLING - MEMORIZE CONFIG METHODS (DATE_2) ------------------------------------');
    container.get('Date2').getTime('aaaa', '1111');
    console.log(container.context.get('Date2'));
    console.log(container.cache.methods);

    console.log('--------------------------- BEFORE CALLING - MEMORIZE CONFIG METHODS (RAMDOM) ------------------------------------');
    console.log(container.context.get('Random'));
    console.log(container.cache.methods);

    console.log('--------------------------- AFTER CALLING - MEMORIZE CONFIG METHODS (RAMDOM) ------------------------------------');
    const random1 = container.get('Random').getRandom1();
    const random2 = container.get('Random').getRandom1();
    console.log(' >> Random 1 and Random 2 should be equals:', random1, random2, random1 === random2); // true
    const random3 = container.get('Random').getRandom2();
    const random4 = container.get('Random').getRandom2();
    console.log(' >> Random 3 and Random 4 should be equals:', random3, random4, random3 === random4); // true
    console.log(container.context.get('Random'));
    console.log(container.cache.methods);

    console.log('--------------------------- AFTER CALLING - MEMORIZE CONFIG METHODS WITH DIFFERENT PROPS (RAMDOM) ------------------------------------');
    const random5 = container.get('Random').getRandom1();
    const random6 = container.get('Random').getRandom1('prop1', 'prop2');
    console.log(' >> Random 5 and Random 6 should be different:', random5, random6, random5 === random6); // false
    console.log(container.context.get('Random'));
    console.log(container.cache.methods);
  };

  const memorizedServicesExcludeMode = () => {
    console.log('--------------------------- BEFORE CALLING - MEMORIZE ALL METHODS EXCEPT EXCLUDED (RandomExclude) ------------------------------------');
    console.log(container.context.get('RandomExclude'));
    console.log(container.cache.methods);

    console.log('--------------------------- AFTER CALLING - MEMORIZE ALL METHODS EXCEPT EXCLUDED (RandomExclude) ------------------------------------');
    container.get('RandomExclude').getRandom1();
    container.get('RandomExclude').getRandom2();
    console.log(container.context.get('RandomExclude'));
    console.log(container.cache.methods);
  };

  addServices();
  addNewProps();
  gettingServices();
  gettingAllServices();
  addServicesForCaching();
  memorizedServices();
  memorizedServicesExcludeMode();
};

module.exports = {
  commonSandboxTests
};


