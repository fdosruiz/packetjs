import { Container } from 'packetjs-di';
import axios from 'axios';
import useHelper from '../hooks/useHelper.ts';
import properties from '../properties/index.json';
import { Properties } from '../@types';

// Create the container
const container = new Container();

// Add configuration properties
container.addProps(properties);

// Add services
container.add('useHelper', ({ props }: { props: Properties }) => useHelper(props));
container.add('useHelperWithCache', ({ props }: { props: Properties }) => useHelper(props), { cache: true });
container.add('axios', ({ props }: { props: Properties }) => {
  return axios.create({
    baseURL: props.axios.baseURL,
  });
});

export default container;
