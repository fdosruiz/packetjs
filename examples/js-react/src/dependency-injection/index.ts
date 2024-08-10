import { Container } from 'packetjs-di';
import Helper from '../services/Helper.ts';
import properties from '../properties/index.json';

/**
 * Create the container
 */
const container = new Container();

/**
 * Add configuration properties
 */
container.addProps(properties);

/**
 * Add services
 */
container.add('Helper', ({ props }) => {
  return new Helper(props);
});

container.add('HelperWithCache', ({ props }) => {
  return new Helper(props);
}, { cache: true });

/**
 * Export the container
 */
export default container;
