import {
  HasuraActionPayload,
  HasuraActionExpressHandler,
} from 'hasura-node-types';

// example action
const helloHandler: HasuraActionExpressHandler<HasuraActionPayload<
  { readonly hello: string },
  'hello'
>> = (_, { input }) => Promise.resolve({ hello: `Hello ${input.hello}` });

const addNumbersHandler: HasuraActionExpressHandler<HasuraActionPayload<
  { readonly numbers: number[] },
  'addNumbers'
>> = (_, { input }) =>
  Promise.resolve({
    sum: input.numbers.reduce((s, n) => s + n, 0),
  });

export default {
  hello: helloHandler,
  addNumbers: addNumbersHandler,
};
