import { Container } from 'packetjs-di/lib/core';
import container from '../../src';

describe('testing entry point', () => {
  it('should get the instance of the container', () => {
    expect(container).toBeInstanceOf(Container);
    expect(typeof container).toBe('object');
  });
});
