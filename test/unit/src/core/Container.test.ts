import Container from '../../../../src/core/Container';
import { containerCommonTests } from '../../common/Container.commonTests';

const middlewareGetProxyMock = jest.fn();

const mocks = {
  middlewareGetProxyMock,
};

jest.mock('../../../../src/core/Middleware', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getProxy: middlewareGetProxyMock,
    };
  });
});

describe('Unit Testing for Container (Source code)', () => {
  containerCommonTests(Container, mocks);
});
