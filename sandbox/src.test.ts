import container from '../src';
import { Container } from '../src/core';
const { commonSandboxTests } = require('./common/common.test');

describe('Integration Testing (Source code)', () => {
  commonSandboxTests(container, Container);
})
