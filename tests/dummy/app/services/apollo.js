import ApolloService from 'ember-apollo-client/services/apollo';
import {
  IntrospectionFragmentMatcher,
  InMemoryCache
} from 'apollo-cache-inmemory';
import schema from 'dummy/gql/schema';
const unionTypes = schema.definitions.filter(d => d.kind === 'UnionTypeDefinition');
const introspectionQueryResultData = {
  __schema: {
    types: unionTypes.map(t => ({
      kind: 'UNION',
      name: t.name.value,
      possibleTypes: t.types.map(t => ({ name: t.name.value }))
    }))
  }
};

export default class extends ApolloService {
  cache() {
    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData
    });

    return new InMemoryCache({ fragmentMatcher });
  }
}
