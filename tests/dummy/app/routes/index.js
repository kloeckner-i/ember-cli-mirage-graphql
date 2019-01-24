import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import query from 'dummy/gql/queries/num-people';

export default Route.extend(RouteQueryManager, {
  model() {
    return this.get('apollo').watchQuery({ query });
  }
});
