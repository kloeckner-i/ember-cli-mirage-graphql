import Controller from '@ember/controller';
import mutation from 'dummy/gql/mutations/update-person-where';
import { contextSet } from 'ember-cli-mirage-graphql/utils';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';

function getAttrsFromForm(form) {
  let inputNodes = [ ...form.querySelectorAll('input') ];

  return inputNodes.reduce((attrs, { name, value }) =>
    contextSet(attrs, name, value), {});
}

export default Controller.extend({
  apollo: service(),
  lastName: oneWay('model.human.lastName'),

  actions: {
    savePerson(id, e) {
      e.preventDefault();

      this.get('apollo').mutate({
        mutation,
        variables: {
          id,
          personAttributes: getAttrsFromForm(e.target)
        }
      });
    }
  }
});
