import { Container } from "./core";
import container from './index';

describe('testing entry point', () => {
  it('should get the instance of the container', () => {
    expect(container).toBeInstanceOf(Container);
    expect(typeof container).toBe('object');
  });
});
