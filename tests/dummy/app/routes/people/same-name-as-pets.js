import Route from '@ember/routing/route';
import query from 'dummy/gql/queries/people-same-name-as-pets';
import { inject as service } from '@ember/service';

export default Route.extend({
  apollo: service(),

  async model() {

    let variables = { name: 'Alice' };
    let model = await this.get('apollo').watchQuery({ query, variables });

    return model;
  }
});
