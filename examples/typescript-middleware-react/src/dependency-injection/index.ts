import { Container } from 'packetjs-di';
import axios, { AxiosResponse } from 'axios';
import useHelper from '../hooks/useHelper.ts';
import useHelperDefinition  from '../@types/useHelper';
import properties from '../properties/index.json';
import { Properties } from "../@types";

// Create the container
const container = new Container();

// Add configuration properties
container.addProps(properties);

// Add services
container.add('useHelper', ({ props }: { props: Properties }) => {
  return useHelper(props);
});

container.add('useHelperWithCache', ({ props }: { props: Properties }) => {
  return useHelper(props);
}, { cache: true });

container.add('axios', ({ props }: { props: Properties }) => {
  return axios.create({
    baseURL: props.axios.baseURL,
  });
});

// Middlewares
container.middleware.add('axios', async (next, context, args) => {
  const { container, methodName } = context;
  const response: AxiosResponse = await next(args);
  if (methodName === 'get' && response.status === 200) {
    const useHelper = container.get<useHelperDefinition>('useHelper');
    const { data } = response;
    data.forEach((comment) => {
      comment.random = useHelper.getRandom();
      comment.uniqId = useHelper.getUniqId();
    });
  }
  return response;
});

// Export the container
export default container;
