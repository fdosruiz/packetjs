import { Container } from "../../src/core";
import container from '../../src';

describe('testing entry point', () => {
  it('should get the instance of the container', () => {
    expect(container).toBeInstanceOf(Container);
    expect(typeof container).toBe('object');
  });
});
