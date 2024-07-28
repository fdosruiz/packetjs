import container from '../../../src';
import { Container } from '../../../src/core';
import { commonSandboxTests } from '../common/common.test';

describe('Integration Testing (Source code)', () => {
  commonSandboxTests(container, Container);
});
