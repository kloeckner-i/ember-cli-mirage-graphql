import Route from '@ember/routing/route';
import query from 'dummy/gql/queries/pets-and-people';
import { queryManager } from "ember-apollo-client";

export default Route.extend({
  apollo: queryManager(),

  model() {
    const apollo = this.get('apollo');
    return apollo.watchQuery({ query });
  }
});
