import container, { Container } from '../../../src';
import { commonSandboxTests } from '../common/common.test';

describe('Integration Testing (Source code)', () => {
  commonSandboxTests(container, Container);
});
