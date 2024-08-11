import useHelper from './useHelper';

interface servicesMap {
  useHelper: () => useHelper;
  useHelperWithCache: () => useHelper;
}

export default servicesMap;
