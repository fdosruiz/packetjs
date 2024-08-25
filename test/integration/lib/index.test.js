import container, { Container } from '../../../lib';
import { commonSandboxTests } from '../common/common.test';

describe('Integration Testing (Lib code)', () => {
  commonSandboxTests(container, Container);
});
