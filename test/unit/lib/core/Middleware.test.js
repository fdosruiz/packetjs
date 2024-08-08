import Container from '../../../../lib/core/Container';
import Middleware from '../../../../lib/core/Middleware';
import { middlewareCommonTests } from '../../common/Middleware.commonTests';

describe('Unit Testing for Middleware (Lib code)', () => {
  middlewareCommonTests(Middleware, Container);
});
