import Container from '../../../lib/core/Container';
import Middleware from '../../../lib/core/Middleware';
import { containerCommonTests } from '../../common/Container.commonTests';

jest.mock('../../../lib/core/Middleware', () => {
  const middlewareGetProxyMock = jest.fn();
  return jest.fn().mockImplementation(() => {
    return {
      getProxy: middlewareGetProxyMock,
      _getMemorizeMethodsMock: () => middlewareGetProxyMock, // provide a getter to access the mock
    };
  });
});

describe('Unit Testing for Container (Lib code)', () => {
  const middleware = new Middleware();
  const mocks = {
    middlewareGetProxyMock: middleware._getMemorizeMethodsMock(),
  };

  containerCommonTests(Container, mocks);
});
