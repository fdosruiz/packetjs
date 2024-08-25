import { Container } from 'packetjs-di';
import useHelper from '../hooks/useHelper';
import properties from '../properties/index.json';
import { Properties } from '../@types';

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
container.add('useHelper', ({ props }: { props: Properties }) => {
  return useHelper(props);
});

container.add('useHelperWithCache', ({ props }: { props: Properties }) => {
  return useHelper(props);
}, { cache: true });

/**
 * Export the container
 */
export default container;
