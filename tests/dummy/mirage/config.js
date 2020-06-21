import { createGraphQLHandler } from 'ember-cli-mirage-graphql/mirage-graphql';
import graphQLSchema from 'dummy/gql/schema';

export default function() {
  const graphqlHandler = createGraphQLHandler({
    graphQLSchema,
    mirageSchema: this.schema,
    resolvers: {
      Mutation: {
        createPerson(_obj, args, context) {
          return context.mirageSchema.db.people.insert(
            { ...args.personAttributes, createdAt: new Date() }
          );
        },
        updatePerson(_obj, args, context) {
          return context.mirageSchema.db.people.update(
            args.id,
            args.personAttributes
          );
        }
      },
      Query: {
        numPeople(_obj, _args, context) {
          return context.mirageSchema.people.all().length;
        }
      }
    }
  });

  this.passthrough('/write-coverage');
  this.post('/graph', graphqlHandler);
}
