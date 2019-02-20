import graphqlHandler from './handlers/graphql';

export default function() {
  this.passthrough('/write-coverage');
  this.post('/graph', graphqlHandler);
}
