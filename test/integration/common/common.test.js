export const commonSandboxTests = (container, Container) => {
  const initProps = { date: '2022-03-18T17:00:03.030Z', url: 'https://example.com' };
  // Add properties
  container.addProps(initProps);

  const addServices = () => {
    container.add('Service1', () => new Date());
    container.add('Service2', ({ props }) => new Date(props.date));
    container.add('Service3', ({ props }) => new URL(props.url));
    container.add('Service4', ({ container: c }) => {
        const service2 = c.get('Service2');
        c.get('Service3');
        return new Date(service2);
    });
    container.add('Service5', () => Math.random() * 1000);
    container.add('Service6', ({ props }) => new Date(props.date));
    container.add('Service7', ({ props }) => new URL(props.url));
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
      };
    };
    container.add('Date', () => {
      return new Date();
    }, { cache: true });
    container.add('Date2', () => {
      return new Date();
    }, { cache: true, methods: ['getTime'] });
    container.add('Random', () => {
      return functionService();
    }, { cache: true, methods: ['getRandom1', 'getRandom2', 'doTimeout'] });
    container.add('RandomExclude', () => {
      return functionService();
    }, { cache: true, methods: ['getRandom1'], excludeMode: true });
  };

  describe('Common Integration Testing (lib + src)', () => {
    addServices();
    addServicesForCaching();

    describe('Adding new properties', () => {
      it('should add new props', () => {
        const newProps = { url: 'https://override.url.com', url2: 'https://example2.com', user: 'Francisco' };
        expect(container.getProps()).toEqual(initProps);

        container.addProps(newProps);
        expect(container.getProps()).toEqual({ ...initProps, ...newProps });
      });
    });

    describe('Adding services', () => {
      it('add multiple services with the same name. Should return the last one', () => {
        const service1 = new Date();
        const service2 = new Date();
        const service3 = new Date();

        container.add('Duplicate', () => service1);
        container.add('Duplicate', () => service2);
        container.add('Duplicate', () => service3);

        const Duplicate = container.get('Duplicate');

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

        const Duplicate2 = container.get('Duplicate2');

        expect(Duplicate2).toBe(service1);
        expect(Duplicate2).not.toBe(service2);
        expect(Duplicate2).not.toBe(service3);
      });
    });

    describe('Getting services', () => {
      it('calling services with factory method (Service 5)', () => {
        // Before calling service 5
        const service5 = container.context.get('Service5');
        expect(service5.key).toBe('Service5');
        expect(service5.callback).toEqual(expect.any(Function));
        expect(service5.options).toBeUndefined();
        expect(service5.instance).toBeNull();
        expect(service5.proxy).toBeNull();

        // After calling service 5
        const service5_1 = container.getFactory('Service5');
        const service5_2 = container.getFactory('Service5');

        expect(service5_1).not.toBe(service5_2);
        expect(service5.key).toBe('Service5');
        expect(service5.callback).toEqual(expect.any(Function));
        expect(service5.options).toBeUndefined();
        expect(service5.instance).toBeNull();
        expect(service5.proxy).toBeNull();
      });

      it('calling services with get method (Service 5)', () => {
        // Before calling service 5
        const service5 = container.context.get('Service5');
        expect(service5.key).toBe('Service5');
        expect(service5.callback).toEqual(expect.any(Function));
        expect(service5.options).toBeUndefined();
        expect(service5.instance).toBeNull();
        expect(service5.proxy).toBeNull();

        // After calling service 5
        const service5_1 = container.get('Service5');
        const service5_2 = container.get('Service5');

        expect(service5_1).toBe(service5_2);
        expect(service5.key).toBe('Service5');
        expect(service5.callback).toEqual(expect.any(Function));
        expect(service5.options).toBeUndefined();
        expect(service5.instance).not.toBeNull();
        expect(service5.proxy).not.toBeNull();
      });

      it('calling services with get method (lazy-load) (Service 4)', () => {
        // Before calling service 4
        const service2 = container.context.get('Service2');
        const service3 = container.context.get('Service3');
        const service4 = container.context.get('Service4');

        expect(service2.key).toBe('Service2');
        expect(service2.callback).toEqual(expect.any(Function));
        expect(service2.options).toBeUndefined();
        expect(service2.instance).toBeNull();
        expect(service2.proxy).toBeNull();

        expect(service3.key).toBe('Service3');
        expect(service3.callback).toEqual(expect.any(Function));
        expect(service3.options).toBeUndefined();
        expect(service3.instance).toBeNull();
        expect(service3.proxy).toBeNull();

        expect(service4.key).toBe('Service4');
        expect(service4.callback).toEqual(expect.any(Function));
        expect(service4.options).toBeUndefined();
        expect(service4.instance).toBeNull();
        expect(service4.proxy).toBeNull();

        // After calling service 4
        container.get('Service4');

        expect(service2.key).toBe('Service2');
        expect(service2.callback).toEqual(expect.any(Function));
        expect(service2.options).toBeUndefined();
        expect(service2.instance).toEqual(expect.any(Date));
        expect(service2.proxy).toEqual(expect.any(Date));

        expect(service3.key).toBe('Service3');
        expect(service3.callback).toEqual(expect.any(Function));
        expect(service3.options).toBeUndefined();
        expect(service3.instance).toEqual(expect.any(URL));
        expect(service3.proxy).toEqual(expect.any(URL));

        expect(service4.key).toBe('Service4');
        expect(service4.callback).toEqual(expect.any(Function));
        expect(service4.options).toBeUndefined();
        expect(service4.instance).toEqual(expect.any(Date));
        expect(service4.proxy).toEqual(expect.any(Date));
      });

      it('calling services with getAll method (lazy-load) (Service 4)', () => {
        // Before calling services 6 and 7
        const service6 = container.context.get('Service6');
        const service7 = container.context.get('Service7');

        expect(service6.key).toBe('Service6');
        expect(service6.callback).toEqual(expect.any(Function));
        expect(service6.options).toBeUndefined();
        expect(service6.instance).toBeNull();
        expect(service6.proxy).toBeNull();

        expect(service7.key).toBe('Service7');
        expect(service7.callback).toEqual(expect.any(Function));
        expect(service7.options).toBeUndefined();
        expect(service7.instance).toBeNull();
        expect(service7.proxy).toBeNull();

        // All services
        const services = container.getAll();
        expect(services.Service1).toEqual(expect.any(Function));
        expect(services.Service2).toEqual(expect.any(Function));
        expect(services.Service3).toEqual(expect.any(Function));
        expect(services.Service4).toEqual(expect.any(Function));
        expect(services.Service5).toEqual(expect.any(Function));
        expect(services.Service6).toEqual(expect.any(Function));
        expect(services.Service7).toEqual(expect.any(Function));
        expect(services.Date).toEqual(expect.any(Function));
        expect(services.Date2).toEqual(expect.any(Function));
        expect(services.Random).toEqual(expect.any(Function));
        expect(services.RandomExclude).toEqual(expect.any(Function));

        // Specific services
        const {
          Service6,
          Service7,
        } = container.getAll();

        expect(Service6).toEqual(expect.any(Function));
        expect(Service7).toEqual(expect.any(Function));

        // GelAll call does not generate an instance
        expect(service6.key).toBe('Service6');
        expect(service6.callback).toEqual(expect.any(Function));
        expect(service6.options).toBeUndefined();
        expect(service6.instance).toBeNull();
        expect(service6.proxy).toBeNull();

        expect(service7.key).toBe('Service7');
        expect(service7.callback).toEqual(expect.any(Function));
        expect(service7.options).toBeUndefined();
        expect(service7.instance).toBeNull();
        expect(service7.proxy).toBeNull();

        // After calling services 6 and 7
        Service6();
        Service7();

        expect(service6.key).toBe('Service6');
        expect(service6.callback).toEqual(expect.any(Function));
        expect(service6.options).toBeUndefined();
        expect(service6.instance).toEqual(expect.any(Date));
        expect(service6.proxy).toEqual(expect.any(Date));

        expect(service7.key).toBe('Service7');
        expect(service7.callback).toEqual(expect.any(Function));
        expect(service7.options).toBeUndefined();
        expect(service7.instance).toEqual(expect.any(URL));
        expect(service7.proxy).toEqual(expect.any(URL));
      });

      it('calling a non registered service with get method', () => {
        expect(() => container.get('NonRegisteredService')).toThrow('The context with key' +
          ' "NonRegisteredService" could not be resolved.');
      });
      it('calling a non registered service with getFactory method', () => {
        expect(() => container.getFactory('NonRegisteredService')).toThrow('The context with key' +
          ' "NonRegisteredService" could not be resolved.');
      });
    });

    describe('Memorize services', () => {
      it('should memorize all methods', () => {
        // Before calling Date service
        const date = container.context.get('Date');

        expect(date.key).toBe('Date');
        expect(date.callback).toEqual(expect.any(Function));
        expect(date.options).toEqual({ cache: true });
        expect(date.instance).toBeNull();
        expect(date.proxy).toBeNull();

        // Cache storage
        expect(container.middleware.cache.storage.size).toBe(0);

        // After calling Date service
        container.get('Date').getTime('aaaa', '1111');

        expect(date.options).toEqual({ cache: true });
        expect(date.instance).toEqual(expect.any(Date));
        expect(date.proxy).toEqual(expect.any(Date));

        // Cache storage
        expect(container.middleware.cache.storage.size).toBe(1);
        expect(container.middleware.cache.storage.keys().next().value).toBe('Date_getTime_["aaaa","1111"]');

        // After recursive calls
        container.get('Date').getTime('aaaa', '1111');
        container.get('Date').getTime('aaaa', '1111');
        container.get('Date').getTime('aaaa', '1111');
        container.get('Date').getTime('aaaa', '1111');
        container.get('Date').getTime('aaaa', '1111');

        // Cache storage
        expect(container.middleware.cache.storage.size).toBe(1);
        expect(container.middleware.cache.storage.keys().next().value).toBe('Date_getTime_["aaaa","1111"]');

        // After calling same method with different props
        container.get('Date').getTime('bbbb', '2222');
        container.get('Date').getTime('cccc', '3333');

        // Cache storage
        let entries = [...container.middleware.cache.storage.entries()];
        expect(container.middleware.cache.storage.size).toBe(3);
        expect(entries[0][0]).toBe('Date_getTime_["aaaa","1111"]');
        expect(entries[1][0]).toBe('Date_getTime_["bbbb","2222"]');
        expect(entries[2][0]).toBe('Date_getTime_["cccc","3333"]');

        // Other methods
        container.get('Date').getDay();
        container.get('Date').getYear();
        container.get('Date').getFullYear();
        container.get('Date').getMonth();
        container.get('Date').toISOString();

        // Cache storage
        entries = [...container.middleware.cache.storage.entries()];
        expect(container.middleware.cache.storage.size).toBe(8);
        expect(entries[0][0]).toBe('Date_getTime_["aaaa","1111"]');
        expect(entries[1][0]).toBe('Date_getTime_["bbbb","2222"]');
        expect(entries[2][0]).toBe('Date_getTime_["cccc","3333"]');
        expect(entries[3][0]).toBe('Date_getDay_[]');
        expect(entries[4][0]).toBe('Date_getYear_[]');
        expect(entries[5][0]).toBe('Date_getFullYear_[]');
        expect(entries[6][0]).toBe('Date_getMonth_[]');
        expect(entries[7][0]).toBe('Date_toISOString_[]');
      });

      it('should memorize only specified methods (Date service)', () => {
        // Before calling Date service
        const date = container.context.get('Date2');

        expect(date.key).toBe('Date2');
        expect(date.callback).toEqual(expect.any(Function));
        expect(date.options).toEqual({ cache: true, methods: ['getTime'] });
        expect(date.instance).toBeNull();
        expect(date.proxy).toBeNull();

        // Cache storage
        let entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(8);

        // After calling methods
        container.get('Date2').getTime();
        container.get('Date2').getDay();
        container.get('Date2').getYear();
        container.get('Date2').getFullYear();
        container.get('Date2').getMonth();
        container.get('Date2').toISOString();

        // Cache storage
        entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(9); // Only one more entry than before (9 instead of 8)
        expect(entries[8][0]).toBe('Date2_getTime_[]');

        // After calling same methods with different props
        container.get('Date2').getTime('aaaa', '1111');
        container.get('Date2').getDay('aaaa', '1111');
        container.get('Date2').getYear('aaaa', '1111');
        container.get('Date2').getFullYear('aaaa', '1111');
        container.get('Date2').getMonth('aaaa', '1111');
        container.get('Date2').toISOString('aaaa', '1111');

        // Cache storage
        entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(10); // Only one more entry than before (10 instead of 9)
        expect(entries[9][0]).toBe('Date2_getTime_["aaaa","1111"]');
      });

      it('should memorize only specified methods (Random service)', () => {
        // Before calling Date service
        const random = container.context.get('Random');

        expect(random.key).toBe('Random');
        expect(random.callback).toEqual(expect.any(Function));
        expect(random.options).toEqual({ cache: true, methods: ['getRandom1', 'getRandom2', 'doTimeout'] });
        expect(random.instance).toBeNull();
        expect(random.proxy).toBeNull();

        // Cache storage
        let entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(10); // before entries was 10

        // After calling methods
        const random1 = container.get('Random').getRandom1();
        const random2 = container.get('Random').getRandom1();
        const random3 = container.get('Random').getRandom2();
        const random4 = container.get('Random').getRandom2();

        expect(random1).toBe(random2);
        expect(random3).toBe(random4);

        // Cache storage
        entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(12); // Only two more entries than before (12 instead of 10)
        expect(entries[10][0]).toBe('Random_getRandom1_[]');
        expect(entries[11][0]).toBe('Random_getRandom2_[]');

        // After calling doTimeout
        const timeout1 = container.get('Random').doTimeout();
        const timeout2 = container.get('Random').doTimeout();

        expect(timeout1).toEqual(expect.any(Promise));
        expect(timeout2).toEqual(expect.any(Promise));
        expect(timeout1).toBe(timeout2);

        // Cache storage
        entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(13); // Only one more entry than before (13 instead of 12)
        expect(entries[12][0]).toBe('Random_doTimeout_[]');

        // After calling same methods with different props
        const random5 = container.get('Random').getRandom1();
        const random6 = container.get('Random').getRandom1('prop1', 'prop2');

        expect(random5).toBe(random1);
        expect(random5).toBe(random2);
        expect(random5).not.toBe(random6);

        // Cache storage
        entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(14); // Only one more entry than before (14 instead of 13)
        expect(entries[13][0]).toBe('Random_getRandom1_["prop1","prop2"]');
      });

      it('should memorize all method except the excluded methods | RandomExclude service | get Method', () => {
        // Before calling Date service
        const random = container.context.get('RandomExclude');

        expect(random.key).toBe('RandomExclude');
        expect(random.callback).toEqual(expect.any(Function));
        expect(random.options).toEqual({ cache: true, methods: ['getRandom1'], excludeMode: true });
        expect(random.instance).toBeNull();
        expect(random.proxy).toBeNull();

        // Cache storage
        let entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(14); // before entries was 14

        // After calling methods
        const random1 = container.get('RandomExclude').getRandom1();
        const random2 = container.get('RandomExclude').getRandom1();
        const random3 = container.get('RandomExclude').getRandom2();
        const random4 = container.get('RandomExclude').getRandom2();
        const timeout1 = container.get('RandomExclude').doTimeout();
        const timeout2 = container.get('RandomExclude').doTimeout();

        expect(random1).not.toBe(random2); // getRandom1 excluded. Not memorized
        expect(random3).toBe(random4);
        expect(timeout1).toEqual(expect.any(Promise));
        expect(timeout2).toEqual(expect.any(Promise));
        expect(timeout1).toBe(timeout2);

        // Cache storage
        entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(16); // Only two more entries than before (16 instead of 14)
        expect(entries[14][0]).toBe('RandomExclude_getRandom2_[]');
        expect(entries[15][0]).toBe('RandomExclude_doTimeout_[]');
      });

      it('should memorize all method except the excluded methods | RandomExclude service | get Method | Disabled proxy', () => {
        // Before calling Date service
        const random = container.context.get('RandomExclude');

        expect(random.key).toBe('RandomExclude');
        expect(random.callback).toEqual(expect.any(Function));
        expect(random.options).toEqual({ cache: true, methods: ['getRandom1'], excludeMode: true });
        expect(random.instance).not.toBeNull();
        expect(random.proxy).not.toBeNull();

        // Cache storage
        let entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(16); // before entries was 16

        // After calling methods
        const random1 = container.get('RandomExclude', false).getRandom1();
        const random2 = container.get('RandomExclude', false).getRandom1();
        const random3 = container.get('RandomExclude', false).getRandom2();
        const random4 = container.get('RandomExclude', false).getRandom2();
        const timeout1 = container.get('RandomExclude', false).doTimeout();
        const timeout2 = container.get('RandomExclude', false).doTimeout();

        expect(random1).not.toBe(random2); // getRandom1 excluded. Not memorized
        expect(random3).not.toBe(random4); // proxy cache is disabled. Not memorized
        expect(timeout1).toEqual(expect.any(Promise));
        expect(timeout2).toEqual(expect.any(Promise));
        expect(timeout1).not.toBe(timeout2); // proxy cache is disabled. Not memorized

        // Cache storage
        entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(16); // before entries was 16
        expect(entries[14][0]).toBe('RandomExclude_getRandom2_[]');
        expect(entries[15][0]).toBe('RandomExclude_doTimeout_[]');
      });

      it('should memorize all method except the excluded methods | RandomExclude service | getFactory Method', () => {
        // Before calling Date service
        const random = container.context.get('RandomExclude');

        expect(random.key).toBe('RandomExclude');
        expect(random.callback).toEqual(expect.any(Function));
        expect(random.options).toEqual({ cache: true, methods: ['getRandom1'], excludeMode: true });
        expect(random.instance).not.toBeNull();
        expect(random.proxy).not.toBeNull();

        // Cache storage
        let entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(16); // before entries was 16

        // After calling methods
        const factory = container.getFactory('RandomExclude');

        const random1 = factory.getRandom1();
        const random2 = factory.getRandom1();
        const random3 = factory.getRandom2();
        const random4 = factory.getRandom2();
        const timeout1 = factory.doTimeout();
        const timeout2 = factory.doTimeout();

        expect(random1).not.toBe(random2); // getRandom1 excluded. Not memorized
        expect(random3).toBe(random4);
        expect(timeout1).toEqual(expect.any(Promise));
        expect(timeout2).toEqual(expect.any(Promise));
        expect(timeout1).toBe(timeout2);

        // Cache storage
        entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(16); // before entries was 16
        expect(entries[14][0]).toBe('RandomExclude_getRandom2_[]');
        expect(entries[15][0]).toBe('RandomExclude_doTimeout_[]');
      });

      it('should memorize all method except the excluded methods | RandomExclude service | getFactory Method | Disabled proxy', () => {
        // Before calling Date service
        const random = container.context.get('RandomExclude');

        expect(random.key).toBe('RandomExclude');
        expect(random.callback).toEqual(expect.any(Function));
        expect(random.options).toEqual({ cache: true, methods: ['getRandom1'], excludeMode: true });
        expect(random.instance).not.toBeNull();
        expect(random.proxy).not.toBeNull();

        // Cache storage
        let entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(16); // before entries was 16

        // After calling methods
        const factory = container.getFactory('RandomExclude', false);

        const random1 = factory.getRandom1();
        const random2 = factory.getRandom1();
        const random3 = factory.getRandom2();
        const random4 = factory.getRandom2();
        const timeout1 = factory.doTimeout();
        const timeout2 = factory.doTimeout();

        expect(random1).not.toBe(random2); // getRandom1 excluded. Not memorized
        expect(random3).not.toBe(random4); // proxy cache disabled
        expect(timeout1).toEqual(expect.any(Promise));
        expect(timeout2).toEqual(expect.any(Promise));
        expect(timeout1).not.toBe(timeout2); // proxy cache disabled

        // Cache storage
        entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(16); // before entries was 16
        expect(entries[14][0]).toBe('RandomExclude_getRandom2_[]');
        expect(entries[15][0]).toBe('RandomExclude_doTimeout_[]');
      });

      it('should memorize all method except the excluded methods | RandomExclude service | GetAll Method', () => {
        // Before calling Date service
        const random = container.context.get('RandomExclude');

        expect(random.key).toBe('RandomExclude');
        expect(random.callback).toEqual(expect.any(Function));
        expect(random.options).toEqual({ cache: true, methods: ['getRandom1'], excludeMode: true });
        expect(random.instance).not.toBeNull();
        expect(random.proxy).not.toBeNull();

        // Cache storage
        let entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(16); // before entries was 16

        // After calling methods
        const { RandomExclude } = container.getAll();

        const random1 = RandomExclude().getRandom1();
        const random2 = RandomExclude().getRandom1();
        const random3 = RandomExclude().getRandom2();
        const random4 = RandomExclude().getRandom2();
        const timeout1 = RandomExclude().doTimeout();
        const timeout2 = RandomExclude().doTimeout();

        expect(random1).not.toBe(random2); // getRandom1 excluded. Not memorized
        expect(random3).toBe(random4);
        expect(timeout1).toEqual(expect.any(Promise));
        expect(timeout2).toEqual(expect.any(Promise));
        expect(timeout1).toBe(timeout2);

        // Cache storage
        entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(16); // before entries was 16
        expect(entries[14][0]).toBe('RandomExclude_getRandom2_[]');
        expect(entries[15][0]).toBe('RandomExclude_doTimeout_[]');
      });

      it('should memorize all method except the excluded methods | RandomExclude service | GetAll Method | Disabled proxy', () => {
        // Before calling Date service
        const random = container.context.get('RandomExclude');

        expect(random.key).toBe('RandomExclude');
        expect(random.callback).toEqual(expect.any(Function));
        expect(random.options).toEqual({ cache: true, methods: ['getRandom1'], excludeMode: true });
        expect(random.instance).not.toBeNull();
        expect(random.proxy).not.toBeNull();

        // Cache storage
        let entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(16); // before entries was 16

        // After calling methods
        const { RandomExclude } = container.getAll(false);

        const random1 = RandomExclude().getRandom1();
        const random2 = RandomExclude().getRandom1();
        const random3 = RandomExclude().getRandom2();
        const random4 = RandomExclude().getRandom2();
        const timeout1 = RandomExclude().doTimeout();
        const timeout2 = RandomExclude().doTimeout();

        expect(random1).not.toBe(random2); // getRandom1 excluded. Not memorized and cache proxy disabled
        expect(random3).not.toBe(random4); // Cache proxy disabled
        expect(timeout1).toEqual(expect.any(Promise));
        expect(timeout2).toEqual(expect.any(Promise));
        expect(timeout1).not.toBe(timeout2); // Cache proxy disabled

        // Cache storage
        entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(16); // before entries was 16
        expect(entries[14][0]).toBe('RandomExclude_getRandom2_[]');
        expect(entries[15][0]).toBe('RandomExclude_doTimeout_[]');
      });

      it('should memorize all methods with DEPRECATED option "cached"', () => {
        const container1 = new Container();
        container1.add('DateDeprecated', () => {
          return new Date();
        }, { cached: true });

        // Before calling Date service
        const date = container1.context.get('DateDeprecated');

        expect(date.key).toBe('DateDeprecated');
        expect(date.callback).toEqual(expect.any(Function));
        expect(date.options).toEqual({ cached: true });
        expect(date.instance).toBeNull();
        expect(date.proxy).toBeNull();

        // Cache storage
        expect(container1.middleware.cache.storage.size).toBe(0);

        // After calling Date service
        container1.get('DateDeprecated').getTime('aaaa', '1111');

        expect(date.options).toEqual({ cached: true });
        expect(date.instance).toEqual(expect.any(Date));
        expect(date.proxy).toEqual(expect.any(Date));

        // Cache storage
        expect(container1.middleware.cache.storage.size).toBe(1);
        expect(container1.middleware.cache.storage.keys().next().value).toBe('DateDeprecated_getTime_["aaaa","1111"]');

        // After recursive calls
        container1.get('DateDeprecated').getTime('aaaa', '1111');
        container1.get('DateDeprecated').getTime('aaaa', '1111');
        container1.get('DateDeprecated').getTime('aaaa', '1111');
        container1.get('DateDeprecated').getTime('aaaa', '1111');
        container1.get('DateDeprecated').getTime('aaaa', '1111');

        // Cache storage
        expect(container1.middleware.cache.storage.size).toBe(1);
        expect(container1.middleware.cache.storage.keys().next().value).toBe('DateDeprecated_getTime_["aaaa","1111"]');

        // After calling same method with different props
        container1.get('DateDeprecated').getTime('bbbb', '2222');
        container1.get('DateDeprecated').getTime('cccc', '3333');

        // Cache storage
        let entries = [...container1.middleware.cache.storage.entries()];
        expect(container1.middleware.cache.storage.size).toBe(3);
        expect(entries[0][0]).toBe('DateDeprecated_getTime_["aaaa","1111"]');
        expect(entries[1][0]).toBe('DateDeprecated_getTime_["bbbb","2222"]');
        expect(entries[2][0]).toBe('DateDeprecated_getTime_["cccc","3333"]');

        // Other methods
        container1.get('DateDeprecated').getDay();
        container1.get('DateDeprecated').getYear();
        container1.get('DateDeprecated').getFullYear();
        container1.get('DateDeprecated').getMonth();
        container1.get('DateDeprecated').toISOString();

        // Cache storage
        entries = [...container1.middleware.cache.storage.entries()];
        expect(container1.middleware.cache.storage.size).toBe(8);
        expect(entries[0][0]).toBe('DateDeprecated_getTime_["aaaa","1111"]');
        expect(entries[1][0]).toBe('DateDeprecated_getTime_["bbbb","2222"]');
        expect(entries[2][0]).toBe('DateDeprecated_getTime_["cccc","3333"]');
        expect(entries[3][0]).toBe('DateDeprecated_getDay_[]');
        expect(entries[4][0]).toBe('DateDeprecated_getYear_[]');
        expect(entries[5][0]).toBe('DateDeprecated_getFullYear_[]');
        expect(entries[6][0]).toBe('DateDeprecated_getMonth_[]');
        expect(entries[7][0]).toBe('DateDeprecated_toISOString_[]');
      });
    });

    describe('Middlewares', () => {
      container.add('RequestFake', () => 'Response of fake service');
      container.add('RequestService', () => {
        return {
          fetch: (arg) => {
            if (!arg) return 'Response of fetch method without args';
            return arg === 'overrideRequest'
              ? 'Response of fetch method with args override'
              : `Response of fetch method with arg: ${arg}`;
          },
          doTimeout: (time) => {
            return new Promise((resolve) => {
              setTimeout(() => resolve(`time lapsed: ${time}`), time);
            });
          },
        };
      });

      beforeEach(() => {
        container.middleware.middlewaresStack.clear();
      });

      it('should not call middleware with fake service | non object instance', () => {
        container.middleware.add('RequestFake',  (next, context, args) => {
          next(args);
          return 'Response of fake middleware';
        }, {
          priority: 0,
          name: 'RequestFake',
        });

        // Before calling RequestFake service
        const middlewares = container.middleware.middlewaresStack;

        expect(middlewares.get('RequestFake')).toHaveLength(1);
        expect(middlewares.get('RequestFake')).toEqual([{
          global: false,
          middleware: expect.any(Function),
          name: "RequestFake",
          priority: 0,
        }]);

        // After calling RequestFake service
        const RequestFake = container.get('RequestFake');
        expect(RequestFake).not.toBe('Response of fake middleware');
        expect(RequestFake).toBe('Response of fake service');
      });

      it('should call service middlewares for RequestService with default priority | object instance | override result and args', () => {
        container.middleware.add('RequestService',  (next, context, args) => {
          let [arg1, arg2] = args;
          arg2.push('Middleware 1 before');
          const result = next(arg1 === 'overrideArgs' ? ['overrideRequest', arg2] : args);
          arg2.push('Middleware 1 after');
          return arg1 === 'override1'
            ? 'Override Request from Middleware 1'
            : result;
        }, {
          priority: 0,
          name: 'RequestService 1',
        });
        container.middleware.add('RequestService',  (next, context, args) => {
          const [arg1, arg2] = args;
          arg2.push('Middleware 2 before');
          const result = next(args);
          arg2.push('Middleware 2 after');
          return arg1 === 'override2'
            ? 'Override Request from Middleware 2'
            : result;
        }, {
          priority: 0,
          name: 'RequestService 2',
        });

        // Before calling Request service
        const middlewares = container.middleware.middlewaresStack;

        expect(middlewares.get('RequestService')).toHaveLength(2);
        expect(middlewares.get('RequestService')).toEqual([{
          global: false,
          middleware: expect.any(Function),
          name: "RequestService 1",
          priority: 0,
        }, {
          global: false,
          middleware: expect.any(Function),
          name: "RequestService 2",
          priority: 0,
        }]);

        // After calling Request service
        const RequestService = container.get('RequestService');
        let arg2 = [];

        expect(RequestService.fetch('original', arg2)).toBe('Response of fetch method with arg: original');

        // Each middleware should be called in order of its priority
        expect(arg2).toEqual([
          'Middleware 1 before',
          'Middleware 2 before',
          'Middleware 2 after',
          'Middleware 1 after',
        ]);

        arg2 = [];

        // Override requests
        expect(RequestService.fetch('override1', arg2)).toBe('Override Request from Middleware 1');
        expect(RequestService.fetch('override2', arg2)).toBe('Override Request from Middleware 2');
        expect(RequestService.fetch('overrideArgs', arg2)).toBe('Response of fetch method with args override');
      });

      it('should call service middlewares with custom priority | object instance | override result and args', () => {
        container.middleware.add('RequestService',  (next, context, args) => {
          const [arg1, arg2] = args;
          arg2.push('Middleware 1 before');
          const result = next(arg1 === 'overrideArgs' ? ['overrideRequest', arg2] : args);
          arg2.push('Middleware 1 after');
          return arg1 === 'override'
            ? 'Override Request from Middleware 1'
            : result;
        }, {
          priority: 0,
          name: 'RequestService 1',
        });
        container.middleware.add('RequestService',  (next, context, args) => {
          const [arg1, arg2] = args;
          arg2.push('Middleware 2 before');
          const result = next(args);
          arg2.push('Middleware 2 after');
          return arg1 === 'override'
            ? 'Override Request from Middleware 2'
            : result;
        }, {
          priority: 1,
          name: 'RequestService 2',
        });

        // Before calling Request service
        const middlewares = container.middleware.middlewaresStack;

        expect(middlewares.get('RequestService')).toHaveLength(2);
        expect(middlewares.get('RequestService')).toEqual([{
          global: false,
          middleware: expect.any(Function),
          name: "RequestService 2",
          priority: 1,
        }, {
          global: false,
          middleware: expect.any(Function),
          name: "RequestService 1",
          priority: 0,
        }]);

        // After calling Request service
        const RequestService = container.get('RequestService');
        let arg2 = [];

        expect(RequestService.fetch('original', arg2)).toBe('Response of fetch method with arg: original');

        // Each middleware should be called in order of its priority (Middleware 2 has higher
        // priority than Middleware 1)
        expect(arg2).toEqual([
          'Middleware 2 before',
          'Middleware 1 before',
          'Middleware 1 after',
          'Middleware 2 after',
        ]);

        arg2 = [];

        // Override requests (Middleware 2 should be called first)
        expect(RequestService.fetch('override', arg2)).toBe('Override Request from Middleware 2');
        expect(RequestService.fetch('overrideArgs', arg2)).toBe('Response of fetch method with args override');
      });

      it('should call global middlewares, together with service middlewares, with default priority' +
        ' | object instance | override result and args ', () => {
        container.middleware.add('RequestService',  (next, context, args) => {
          const [arg1, arg2] = args;
          arg2.push('Middleware 1 before');
          const result = next(arg1 === 'overrideArgs' ? ['overrideRequest', arg2] : args);
          arg2.push('Middleware 1 after');
          return arg1 === 'override'
            ? 'Override Request from Middleware 1'
            : result;
        }, {
          priority: 0,
          name: 'RequestService 1',
        });
        container.middleware.add('RequestService',  (next, context, args) => {
          const [arg1, arg2] = args;
          arg2.push('Middleware 2 before');
          const result = next(args);
          arg2.push('Middleware 2 after');
          return arg1 === 'override'
            ? 'Override Request from Middleware 2'
            : result;
        }, {
          priority: 0,
          name: 'RequestService 2',
        });
        container.middleware.addGlobal((next, context, args) => {
          const [arg1, arg2] = args;
          arg2.push('Global Middleware 1 before');
          const result = next(args);
          arg2.push('Global Middleware 1 after');
          return arg1 === 'overrideGlobal'
            ? 'Override Request from global Middleware 1'
            : result;
        }, {
          priority: 0,
          name: 'Global 1',
        });
        container.middleware.addGlobal((next, context, args) => {
          const [arg1, arg2] = args;
          arg2.push('Global Middleware 2 before');
          const result = next(args);
          arg2.push('Global Middleware 2 after');
          return arg1 === 'overrideGlobal'
            ? 'Override Request from global Middleware 2'
            : result;
        }, {
          priority: 0,
          name: 'Global 2',
        });

        // Before calling Request service
        const middlewares = container.middleware.middlewaresStack;

        expect(middlewares.get('RequestService')).toHaveLength(2);
        expect(middlewares.get('global')).toHaveLength(2);
        expect(middlewares.get('RequestService')).toEqual([{
          global: false,
          middleware: expect.any(Function),
          name: "RequestService 1",
          priority: 0,
        }, {
          global: false,
          middleware: expect.any(Function),
          name: "RequestService 2",
          priority: 0,
        }]);
        expect(middlewares.get('global')).toEqual([{
          global: true,
          middleware: expect.any(Function),
          name: "Global 1",
          priority: 0,
        }, {
          global: true,
          middleware: expect.any(Function),
          name: "Global 2",
          priority: 0,
        }]);

        // After calling Request service
        const RequestService = container.get('RequestService');
        let arg2 = [];

        expect(RequestService.fetch('original', arg2)).toBe('Response of fetch method with arg: original');

        // Each middleware should be called in order of its priority
        expect(arg2).toEqual([
          'Global Middleware 1 before',
          'Global Middleware 2 before',
          'Middleware 1 before',
          'Middleware 2 before',
          'Middleware 2 after',
          'Middleware 1 after',
          'Global Middleware 2 after',
          'Global Middleware 1 after',
        ]);

        arg2 = [];

        // Override requests
        expect(RequestService.fetch('overrideGlobal', arg2)).toBe('Override Request from global Middleware 1');
        expect(RequestService.fetch('override', arg2)).toBe('Override Request from Middleware 1');
        expect(RequestService.fetch('overrideArgs', arg2)).toBe('Response of fetch method with args override');
      });

      it('should call global middlewares, together with service middlewares, with custom priority' +
        ' | object instance | override result and args', () => {
        container.middleware.add('RequestService',  (next, context, args) => {
          const [arg1, arg2] = args;
          arg2.push('Middleware 1 before');
          const result = next(arg1 === 'overrideArgs' ? ['overrideRequest', arg2] : args);
          arg2.push('Middleware 1 after');
          return arg1 === 'override'
            ? 'Override Request from Middleware 1'
            : result;
        }, {
          priority: 0,
          name: 'RequestService 1',
        });
        container.middleware.add('RequestService',  (next, context, args) => {
          const [arg1, arg2] = args;
          arg2.push('Middleware 2 before');
          const result = next(args);
          arg2.push('Middleware 2 after');
          return arg1 === 'override'
            ? 'Override Request from Middleware 2'
            : result;
        }, {
          priority: 20,
          name: 'RequestService 2',
        });
        container.middleware.addGlobal((next, context, args) => {
          const [arg1, arg2] = args;
          arg2.push('Global Middleware 1 before');
          const result = next(args);
          arg2.push('Global Middleware 1 after');
          return arg1 === 'overrideGlobal'
            ? 'Override Request from global Middleware 1'
            : result;
        }, {
          priority: 0,
          name: 'Global 1',
        });
        container.middleware.addGlobal((next, context, args) => {
          const [arg1, arg2] = args;
          arg2.push('Global Middleware 2 before');
          const result = next(args);
          arg2.push('Global Middleware 2 after');
          return arg1 === 'overrideGlobal'
            ? 'Override Request from global Middleware 2'
            : result;
        }, {
          priority: 10,
          name: 'Global 2',
        });

        // Before calling Request service
        const middlewares = container.middleware.middlewaresStack;

        expect(middlewares.get('RequestService')).toHaveLength(2);
        expect(middlewares.get('global')).toHaveLength(2);
        expect(middlewares.get('RequestService')).toEqual([{
          global: false,
          middleware: expect.any(Function),
          name: "RequestService 2",
          priority: 20,
        }, {
          global: false,
          middleware: expect.any(Function),
          name: "RequestService 1",
          priority: 0,
        }]);
        expect(middlewares.get('global')).toEqual([{
          global: true,
          middleware: expect.any(Function),
          name: "Global 2",
          priority: 10,
        }, {
          global: true,
          middleware: expect.any(Function),
          name: "Global 1",
          priority: 0,
        }]);

        // After calling Request service
        const RequestService = container.get('RequestService');
        let arg2 = [];

        expect(RequestService.fetch('original', arg2)).toBe('Response of fetch method with arg: original');

        // Each middleware should be called in order of its priority
        expect(arg2).toEqual([
          'Global Middleware 2 before',
          'Global Middleware 1 before',
          'Middleware 2 before',
          'Middleware 1 before',
          'Middleware 1 after',
          'Middleware 2 after',
          'Global Middleware 1 after',
          'Global Middleware 2 after',
        ]);

        arg2 = [];

        // Override requests
        expect(RequestService.fetch('overrideGlobal', arg2)).toBe('Override Request from global Middleware 2');
        expect(RequestService.fetch('override', arg2)).toBe('Override Request from Middleware 2');
        expect(RequestService.fetch('overrideArgs', arg2)).toBe('Response of fetch method with args override');
      });

      it('should return an error when call next multiple times', () => {
        container.middleware.add('RequestService',  (next, context, args) => {
          next(args); // call next() multiple times
          return next(args);
        }, {
          priority: 0,
          name: 'RequestService 1',
        });
        container.middleware.add('RequestService',  (next, context, args) => {
          return next(args);
        }, {
          priority: 0,
          name: 'RequestService 2',
        });

        // After calling Request service
        const RequestService = container.get('RequestService');
        expect(() => { RequestService.fetch(); }).toThrowError('next() called multiple times');
      });

      it('service should receive the params without args in the next function', () => {
        container.middleware.add('RequestService',  (next) => {
          return next();
        }, {
          priority: 0,
          name: 'RequestService 1',
        });

        // After calling Request service
        const RequestService = container.get('RequestService');
        expect(RequestService.fetch('param1')).toBe('Response of fetch method with arg: param1');
      });

      it('should config a middleware before add the service to container', () => {
        container.middleware.add('NewService',  (next, context, args) => {
          const [arg1] = args;
          arg1.push('NewService 1 before');
          const result = next(args);
          arg1.push('NewService 1 after');
          return result;
        }, {
          priority: 0,
          name: 'NewService 1',
        });

        // Call the service
        expect(() => container.get('NewService')).toThrow('The context with key "NewService" could not be resolved.');

        // Config the new service
        container.add('NewService', () => {
          return {
            fetch: () => 'Response of new service',
          };
        });

        // Call the service
        const arg1 = [];
        const NewService2 = container.get('NewService');
        expect(NewService2).toBeInstanceOf(Object);
        expect(NewService2.fetch(arg1)).toBe('Response of new service');
        expect(arg1).toEqual(['NewService 1 before', 'NewService 1 after']);
      });

      it('should call async/await middleware', (done) => {
        let response;
        container.middleware.add('RequestService', async (next, context, args) => {
          const result = await next(args);
          response = result;
          return result;
        });

        // Before calling Request service
        const middlewares = container.middleware.middlewaresStack;
        expect(middlewares.get('RequestService')).toHaveLength(1);

        // After calling Request service
        const RequestService = container.get('RequestService');
        RequestService.doTimeout(10).then((result) => {
          expect(result).toBe('time lapsed: 10');
          expect(response).toBe(result);
          expect(response).not.toEqual(expect.any(Promise));
          done();
        });
      });

      it('should register a middleware after call a service and purge the context', () => {
        let response;
        container.middleware.add('RequestService', (next, context, args) => {
          const result = next(args);
          response = result;
          return result;
        });

        // Before calling Request service
        let middlewares = container.middleware.middlewaresStack;
        expect(middlewares.get('RequestService')).toHaveLength(1);

        // After calling Request service
        let RequestService = container.get('RequestService');
        let fetchResponse = RequestService.fetch();
        expect(fetchResponse).toBe('Response of fetch method without args');
        expect(fetchResponse).toBe(response);

        // Add a new middleware. Purge the instance and the proxy from the container
        container.middleware.add('RequestService', (next, context, args) => {
          response = next(args);
          return 'Response of middleware declared after the service';
        });

        // Before calling Request service again
        middlewares = container.middleware.middlewaresStack;
        expect(middlewares.get('RequestService')).toHaveLength(2);

        // After calling Request service again
        RequestService = container.get('RequestService');
        fetchResponse = RequestService.fetch();
        expect(fetchResponse).toBe('Response of middleware declared after the service');
        expect(fetchResponse).toBe(response);
      });

      it('should register a global middleware after call a service and dont purge the context', () => {
        let response;
        let responseGlobal;
        container.middleware.add('RequestService', (next, context, args) => {
          const result = next(args);
          response = result;
          return result;
        });

        // Before calling Request service
        let middlewares = container.middleware.middlewaresStack;
        expect(middlewares.get('RequestService')).toHaveLength(1);

        // After calling Request service
        let RequestService = container.get('RequestService');
        let fetchResponse = RequestService.fetch();
        expect(fetchResponse).toBe('Response of fetch method without args');
        expect(fetchResponse).toBe(response);

        // Add a new middleware. Purge the instance and the proxy from the container
        container.middleware.addGlobal((next, context, args) => {
          responseGlobal = next(args);
          return 'Response of global middleware declared after the service';
        });

        // Before calling Request service again
        middlewares = container.middleware.middlewaresStack;
        expect(middlewares.get('RequestService')).toHaveLength(1);

        // After calling Request service again
        RequestService = container.get('RequestService');
        fetchResponse = RequestService.fetch();
        expect(fetchResponse).toBe('Response of fetch method without args');
        expect(fetchResponse).not.toBe(responseGlobal);
      });
    });

    describe('Middlewares together with Cache', () => {
      beforeEach(() => {
        container.middleware.middlewaresStack.clear();
      });

      it('should call global middlewares, together with service and CACHE middleware, with custom priority | object instance', () => {
        container.context.clear();
        container.middleware.add('NewService',  (next, context, args) => {
          const [arg1] = args;
          arg1.push('Middleware 1 before');
          const result = next(args);
          arg1.push('Middleware 1 after');
          return result;
        }, {
          priority: 0,
          name: 'NewService 1',
        });
        container.middleware.add('NewService',  (next, context, args) => {
          const [arg1] = args;
          arg1.push('Middleware 2 before');
          const result = next(args);
          arg1.push('Middleware 2 after');
          return result;
        }, {
          priority: 20,
          name: 'NewService 2',
        });
        container.middleware.addGlobal((next, context, args) => {
          const [arg1] = args;
          arg1.push('Global Middleware 1 before');
          const result = next(args);
          arg1.push('Global Middleware 1 after');
          return result;
        }, {
          priority: 0,
          name: 'Global 1',
        });
        container.middleware.addGlobal((next, context, args) => {
          const [arg1] = args;
          arg1.push('Global Middleware 2 before');
          const result = next(args);
          arg1.push('Global Middleware 2 after');
          return result;
        }, {
          priority: 10,
          name: 'Global 2',
        });

        container.add('NewService', () => {
          return {
            fetch: () => 'Response of new service',
          };
        }, { cache: true });

        // Before calling Request service
        let middlewares = container.middleware.middlewaresStack;

        expect(middlewares.get('NewService')).toHaveLength(2);
        expect(middlewares.get('global')).toHaveLength(2);
        expect(middlewares.get('NewService')).toEqual([{
          global: false,
          middleware: expect.any(Function),
          name: "NewService 2",
          priority: 20,
        }, {
          global: false,
          middleware: expect.any(Function),
          name: "NewService 1",
          priority: 0,
        }]);
        expect(middlewares.get('global')).toEqual([{
          global: true,
          middleware: expect.any(Function),
          name: "Global 2",
          priority: 10,
        }, {
          global: true,
          middleware: expect.any(Function),
          name: "Global 1",
          priority: 0,
        }]);

        // After calling Request service
        const RequestService = container.get('NewService');
        middlewares = container.middleware.middlewaresStack;
        expect(middlewares.get('NewService')).toHaveLength(3);
        expect(middlewares.get('global')).toHaveLength(2);
        expect(middlewares.get('NewService')).toEqual([{
          global: false,
          middleware: expect.any(Function),
          name: "NewService 2",
          priority: 20,
        }, {
          global: false,
          middleware: expect.any(Function),
          name: "NewService 1",
          priority: 0,
        }, {
          global: false,
          middleware: expect.any(Function),
          name: "Cache",
          priority: -1000,
        }]);
        expect(middlewares.get('global')).toEqual([{
          global: true,
          middleware: expect.any(Function),
          name: "Global 2",
          priority: 10,
        }, {
          global: true,
          middleware: expect.any(Function),
          name: "Global 1",
          priority: 0,
        }]);
        let arg1 = [];

        expect(RequestService.fetch(arg1)).toBe('Response of new service');

        // Each middleware should be called in order of its priority
        expect(arg1).toEqual([
          'Global Middleware 2 before',
          'Global Middleware 1 before',
          'Middleware 2 before',
          'Middleware 1 before',
          'Middleware 1 after',
          'Middleware 2 after',
          'Global Middleware 1 after',
          'Global Middleware 2 after',
        ]);

        // Cache storage
        let entries = [...container.middleware.cache.storage.entries()];
        expect(entries).toHaveLength(17); // before entries was 16
        expect(entries[16][0]).toBe('NewService_fetch_[["GlobalMiddleware2before",' +
          '"GlobalMiddleware1before","Middleware2before","Middleware1before"]]');
        expect(entries[16][1]).toBe('Response of new service');
      });
    });

    describe('Instancing containers', () => {
      it('global container should be the same that static property from Container', () => {
        expect(container).toBe(Container.container);
      });

      it('should get different containers with different services', () => {
        const container1 = new Container();
        const container2 = new Container();

        // Container should be different
        expect(container1).not.toBe(container2);

        container1.add('NewService', () => {
          return { fetch: () => 'Response of new service' };
        });

        container2.add('NewService', () => {
          return { fetch: () => 'Response of new service' };
        });

        // Service should be different
        const NewService1 = container1.get('NewService');
        const NewService2 = container2.get('NewService');
        expect(NewService1).not.toBe(NewService2);

        // Service should be the same
        const NewService1a = container1.get('NewService');
        const NewService2a = container2.get('NewService');
        expect(NewService1).toBe(NewService1a);
        expect(NewService2).toBe(NewService2a);
      });

      it('cache should be independent between containers', () => {
        const container1 = new Container();
        const container2 = new Container();

        // Container should be different
        expect(container1).not.toBe(container2);

        container1.add('NewService', () => {
          return { fetch: () => 'Response of new service 1' };
        }, { cache: true });

        container2.add('NewService', () => {
          return { fetch: () => 'Response of new service 2' };
        }, { cache: true });

        // Service should be different
        const NewService1 = container1.get('NewService');
        const NewService2 = container2.get('NewService');
        expect(NewService1).not.toBe(NewService2);

        // Caching methods
        NewService1.fetch();
        NewService2.fetch();
        expect(NewService1.fetch()).toBe('Response of new service 1');
        expect(NewService2.fetch()).toBe('Response of new service 2');

        // Cache entries
        const entries1 = [...container1.middleware.cache.storage.entries()];
        const entries2 = [...container2.middleware.cache.storage.entries()];
        expect(entries1[0][0]).toBe('NewService_fetch_[]');
        expect(entries1[0][1]).toBe('Response of new service 1');
        expect(entries2[0][0]).toBe('NewService_fetch_[]');
        expect(entries2[0][1]).toBe('Response of new service 2');
      });

      it('should disable the proxy globally in the container', () => {
        const middleware1 = [];
        const middleware2 = [];
        const container1 = new Container({ middlewareProxy: false });
        const container2 = new Container({ middlewareProxy: true });

        container1.add('NewService', () => {
          return { fetch: () => 'Response of new service 1' };
        });

        container2.add('NewService', () => {
          return { fetch: () => 'Response of new service 2' };
        });

        container1.middleware.add('NewService',  (next, context, args) => {
          const result = next(args);
          middleware1.push(result);
          return result;
        });

        container2.middleware.add('NewService',  (next, context, args) => {
          const result = next(args);
          middleware2.push(result);
          return result;
        });

        // Call the service
        const result1 = container1.get('NewService').fetch();
        const result2 = container2.get('NewService').fetch();

        // Middleware should not be called
        expect(result1).toBe('Response of new service 1');
        expect(middleware1).toHaveLength(0);

        // Middleware should be called
        expect(result2).toBe('Response of new service 2');
        expect(middleware2).toHaveLength(1);
        expect(middleware2[0]).toBe('Response of new service 2');
      });

      it('cache should be enabled when the proxy is globally disabled in the container', () => {
        // Proxy is disabled globally and cache is enabled
        let container = new Container({ middlewareProxy: false });
        const serviceFunction1 = new Date('2000-01-01T00:00:00.000Z');
        const callback1 = () => serviceFunction1;
        container.add('service1', callback1, { cache: true });
        const service1 = container.get('service1');
        let context = [...container.context.entries()][0];

        // Service 1
        expect(context[0]).toBe('service1');
        expect(context[1].instance).toBe(serviceFunction1);
        expect(context[1].proxy).toEqual(expect.any(Date));
        expect(service1).toEqual(expect.any(Date));

        // Proxy is disabled globally and cache is enabled (Deprecated cached option)
        container = new Container({ middlewareProxy: false });
        const serviceFunction2 = new Date('2000-01-01T00:00:01.000Z');
        const callback2 = () => serviceFunction2;
        container.add('service2', callback2, { cached: true });
        const service2 = container.get('service2');
        context = [...container.context.entries()][0];
        console.log(context);

        // Service 2
        expect(context[0]).toBe('service2');
        expect(context[1].instance).toBe(serviceFunction2);
        expect(context[1].proxy).toEqual(expect.any(Date));
        expect(service2).toEqual(expect.any(Date));
      });

      it('should enable the freeze option globally in the container', () => {
        const container1 = new Container({ freeze: true });
        const container2 = new Container({ freeze: false });

        const service1 = new Date();
        const service2 = new Date();
        const service3 = new Date();

        // Freeze should be enabled
        container1.add('Duplicate1', () => service1);
        container1.add('Duplicate1', () => service2);
        container1.add('Duplicate1', () => service3);

        const Duplicate1 = container1.get('Duplicate1');

        // First service should be the same
        expect(Duplicate1).toBe(service1);
        expect(Duplicate1).not.toBe(service2);
        expect(Duplicate1).not.toBe(service3);

        // Freeze should be disabled
        container2.add('Duplicate2', () => service1);
        container2.add('Duplicate2', () => service2);
        container2.add('Duplicate2', () => service3);

        const Duplicate2 = container2.get('Duplicate2');

        // Third service should be the same
        expect(Duplicate2).not.toBe(service1);
        expect(Duplicate2).not.toBe(service2);
        expect(Duplicate2).toBe(service3);
      });
    });
  });
};
