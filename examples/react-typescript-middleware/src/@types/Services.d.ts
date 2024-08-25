import useHelper from './useHelper';
import { Axios } from "axios";

interface servicesMap {
  axios: () => Axios;
  useHelper: () => useHelper;
  useHelperWithCache: () => useHelper;
}

export default servicesMap;
