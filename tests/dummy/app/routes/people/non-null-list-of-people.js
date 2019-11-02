import Route from '@ember/routing/route';
import query from 'dummy/gql/queries/non-null-list-of-people';
import { inject as service } from '@ember/service';

export default Route.extend({
  apollo: service(),

  async model() {
    let model = await this.get('apollo').watchQuery({ query });

    return model;
  }
});
