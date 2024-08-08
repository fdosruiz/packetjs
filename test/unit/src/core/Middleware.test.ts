import Middleware from '../../../../src/core/Middleware';
import Container from '../../../../src/core/Container';
import { middlewareCommonTests } from '../../common/Middleware.commonTests';

describe('Unit Testing for Middleware (Source code)', () => {
  middlewareCommonTests(Middleware, Container);
});
