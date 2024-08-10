import useHelper from './useHelper';

interface hooksMap {
  useHelper: () => useHelper;
  useHelperWithCache: () => useHelper;
}

export default hooksMap;
