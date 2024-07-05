import Container from '../../../lib/core/Container';
import Cache from '../../../lib/core/Cache';
import { containerCommonTests } from '../../common/Container.commonTests';

jest.mock('../../../lib/core/Cache', () => {
    const memorizeMethodsMock = jest.fn();
    return jest.fn().mockImplementation(() => ({
        memorizeMethods: memorizeMethodsMock,
        _getMemorizeMethodsMock: () => memorizeMethodsMock, // provide a getter to access the mock
    }));
});

describe('Testing Container LIB', () => {
  const cache = new Cache();
  containerCommonTests(Container, cache._getMemorizeMethodsMock());
});
