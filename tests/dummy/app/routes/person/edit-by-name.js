import Route from '@ember/routing/route';

export default Route.extend({
  templateName: 'person/edit',
  model() {
    return this.modelFor('person');
  }
});
