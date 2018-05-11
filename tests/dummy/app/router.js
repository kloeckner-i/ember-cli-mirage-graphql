import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('people', function() {
    this.route('same-age-as-dog-years');
  });
  this.route('person', { path: '/person/:person_id' }, function() {
    this.route('edit');
  });
});

export default Router;
