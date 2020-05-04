import Controller from '@ember/controller';
import mutation from 'dummy/gql/mutations/create-person';
import { contextSet } from 'ember-cli-mirage-graphql/utils';
import { inject as service } from '@ember/service';

function getAttrsFromForm(form) {
  let inputNodes = [ ...form.querySelectorAll('input') ];

  return inputNodes.reduce((attrs, { name, value }) =>
    contextSet(attrs, name, value), {});
}

export default Controller.extend({
  apollo: service(),
  lastName: '',
  firstName: '',
  age: null,

  actions: {
    async savePerson(e) {
      e.preventDefault();

      let attrs = getAttrsFromForm(e.target)
      attrs.age = Number(attrs.age)

      let { createPerson } = await this.get('apollo').mutate({
        mutation,
        variables: {
          personAttributes: attrs
        }
      });

      this.transitionToRoute('person', createPerson[0].id);
    }
  }
});
