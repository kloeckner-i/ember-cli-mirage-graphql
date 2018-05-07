import graphqlHandler from './handlers/graphql';

export default function() {
  this.post('/graph', graphqlHandler);
}
