import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import query from 'dummy/gql/queries/people';

export default Route.extend(RouteQueryManager, {
  queryParams: {
    firstName: { refreshModel: true },
    lastName: { refreshModel: true },
    pageSize: { refreshModel: true }
  },

  model(params) {
    return this.get('apollo').watchQuery({
      query,
      variables: {
        firstName: params.firstName,
        lastName: params.lastName,
        pageSize: params.pageSize
      }
    });
  }
});
