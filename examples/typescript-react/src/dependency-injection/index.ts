import { Container } from 'packetjs-di';
import useHelper from '../hooks/useHelper.ts';
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
container.add('useHelper', ({ props }) => {
  return useHelper(props);
});

container.add('useHelperWithCache', ({ props }) => {
  return useHelper(props);
}, { cache: true });

/**
 * Export the container
 */
export default container;
