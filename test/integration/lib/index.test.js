import container from '../../../lib';
import { Container } from '../../../lib/core';
import { commonSandboxTests } from '../common/common.test';

describe('Integration Testing (Lib code)', () => {
  commonSandboxTests(container, Container);
})
