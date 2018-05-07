import createGraphQLHandler from 'ember-cli-mirage-graphql/handler';
import schema from 'dummy/gql/schema';

const OPTIONS = {
  fieldsMap: {
    Person: {
      pets: 'animals'
    }
  },
  varsMap: {
    Person: {
      pageSize: (records, _, pageSize) => records.slice(0, pageSize)
    }
  }
};

export default createGraphQLHandler(schema, OPTIONS);
