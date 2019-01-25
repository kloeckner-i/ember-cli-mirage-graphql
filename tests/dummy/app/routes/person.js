import Route from '@ember/routing/route';
import query from 'dummy/gql/queries/person';
import { inject as service } from '@ember/service';

export default Route.extend({
  apollo: service(),

  async model(params) {
    let model = await this.get('apollo').watchQuery({
      query,
      variables: {
        id: params.person_id
      }
    });

    return model;
  }
});
