const container = require('../lib');
import { Container } from '../lib/core';
const { commonSandboxTests } = require('./common/common.test');

describe('Integration Testing (Lib code)', () => {
  commonSandboxTests(container, Container);
})
