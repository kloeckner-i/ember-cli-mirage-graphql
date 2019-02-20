import Controller from '@ember/controller';

export default Controller.extend({
  lastName: null,
  queryParams: ['lastName', 'pageSize'],
  pageSize: 10
});
