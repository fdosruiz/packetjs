import container from './container';
import { AxiosResponse } from 'axios';
import { Comments, useHelperDefinition } from '../@types';

// Middleware
container.middleware.add('axios', async (next, context, args) => {
  const { container, methodName } = context;
  // Call the next middleware and get the response
  const response: AxiosResponse = await next(args);

  if (methodName === 'get' && response.status === 200) {
    const { data: comments }: { data: Comments[] } = response;
    // Get the useHelper from the container
    const useHelper = container.get<useHelperDefinition>('useHelper');
    // Update comments by reference
    comments.forEach((comment) => {
      comment.random = useHelper.getRandom();
      comment.uniqId = useHelper.getUniqId();
    });
  }

  return response;
});
