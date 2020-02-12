import Route from '@ember/routing/route';
import query from 'dummy/gql/queries/pets-and-people';
import { inject as service } from '@ember/service';

export default Route.extend({
  apollo: service(),

  model() {
    const apollo = this.get('apollo');
    return apollo.watchQuery({ query });
  }
});
