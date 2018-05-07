import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import query from 'dummy/gql/queries/person';

export default Route.extend(RouteQueryManager, {
  model(params) {
    return this.get('apollo').watchQuery({
      query,
      variables: {
        id: params.person_id
      }
    });
  }
});
