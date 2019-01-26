import Filter from 'ember-cli-mirage-graphql/filter/model';
import { module, test } from 'qunit';

module('Unit | Filter | model', function() {
  test('it assumes the resolved name matches the name, on init', function(assert) {
    let name = 'foo';
    let filter = Filter.create({ name });

    assert.equal(filter.resolvedName, name, 'Resolved name is name');
  });
});
