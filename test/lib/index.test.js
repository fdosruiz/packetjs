import { Container } from "../../lib/core";
import container from '../../lib';

describe('testing entry point', () => {
  it('should get the instance of the container', () => {
    expect(container).toBeInstanceOf(Container);
    expect(typeof container).toBe('object');
  });
});
