// import graphqlHandler from './handlers/graphql';
import { createGraphQLHandler } from 'ember-cli-mirage-graphql/mirage-graphql';
import graphQLSchema from 'dummy/gql/schema';

export default function() {
  const graphqlHandler = createGraphQLHandler({
    graphQLSchema,
    mirageSchema: this.schema,
    resolvers: {
      Query: {
        numPeople: () => this.schema.people.all().length
      }
    }
  });

  this.passthrough('/write-coverage');
  this.post('/graph', graphqlHandler);
}
