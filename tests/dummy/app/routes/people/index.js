import Route from '@ember/routing/route';
import query from 'dummy/gql/queries/people';
import { inject as service } from '@ember/service';

export default Route.extend({
  apollo: service(),

  queryParams: {
    firstName: { refreshModel: true },
    lastName: { refreshModel: true },
    pageSize: { refreshModel: true }
  },

  async model(params) {
    let model = await this.get('apollo').watchQuery({
      query,
      variables: {
        firstName: params.firstName,
        lastName: params.lastName,
        pageSize: params.pageSize
      }
    });

    return model;
  }
});
