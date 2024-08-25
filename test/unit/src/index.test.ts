import container, { Container } from '../../../src';

describe('Unit Testing for entry point (Source code)', () => {
  it('should get the instance of the container', () => {
    expect(container).toBeInstanceOf(Container);
    expect(typeof container).toBe('object');
  });
});
