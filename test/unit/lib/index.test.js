import container, { Container } from '../../../lib';

describe('Unit Testing for entry point (Lib code)', () => {
  it('should get the instance of the container', () => {
    expect(container).toBeInstanceOf(Container);
    expect(typeof container).toBe('object');
  });
});
