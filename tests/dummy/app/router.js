import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('customer', { path: '/customer/:customer_id' });
  this.route('people', function() {
    this.route('non-null-list-of-people');
    this.route('same-age-as-dog-years');
    this.route('same-name-as-pets');
  });
  this.route('person', { path: '/person/:person_id' }, function() {
    this.route('edit');
  });
  this.route('pets-and-people');
});

export default Router;
