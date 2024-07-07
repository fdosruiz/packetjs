import Container from '../../../src/core/Container';
import { containerCommonTests } from '../../common/Container.commonTests';

const memorizeMethodsMock = jest.fn();

jest.mock('../../../src/core/Cache', () => {
  return jest.fn().mockImplementation(() => {
    return {memorizeMethods: memorizeMethodsMock};
  });
});

describe('Testing Container CORE', () => {
  containerCommonTests(Container, memorizeMethodsMock);
});
