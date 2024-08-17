# Middleware example using `axios`

The following example shows how to add a middleware to intercept the requests for the `axios` library.

First, we declare the `axios` instance to the container:

```typescript
import { Container } from 'packetjs-di';
import axios from 'axios';
import properties from './properties/index.json';
import { Properties } from './@types';

// Create the container
const container = new Container();

// Add configuration properties
container.addProps(properties);

// Add the axios service
container.add('axios', ({ props }: { props: Properties }) => {
  return axios.create({
    baseURL: props.axios.baseURL, // jsonplaceholder.typicode.com
  });
});
```

Next, we register the middleware:

```typescript
import { AxiosResponse } from 'axios';
import { Comments, HelperDefinition } from "./@types";

container.middleware.add('axios', async (next, context, args) => {
  // We can access the service name, method name and container
  const { container, methodName } = context;

  // We can override the arguments if needed
  console.log('arguments', args);

  // Call the next middleware and get the response
  const response: AxiosResponse = await next(args);

  // Here we can modify the response
  if (methodName === 'get' && response.status === 200) {
    const { data: comments }: { data: Comments[] } = response;

    // Get the Helper from the container
    const Helper = container.get<HelperDefinition>('Helper');

    // Update comments by reference
    comments.forEach((comment) => {
      comment.random = Helper.getRandom();
      comment.uniqId = Helper.getUniqId();
    });
  }

  return response;
}, {
  priority: 1,
  name: 'axiosService'
});
```

> The context object contains information about the service name, method name and container. You can get any service
> declared in the container through the Container instance using the `get()`, `getAll()` or `getFactory()` methods.

Here's how to make the request that will be processed by the middleware:

```typescript
const axios = container.get<Axios>('axios');

axios.get('/comments').then(({ data: comments }) => {
  console.log(comments);
});
```
