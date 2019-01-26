import Filter from 'ember-cli-mirage-graphql/filter/model';
import sortFilters from 'ember-cli-mirage-graphql/filter/sort';
import { module, test } from 'qunit';

module('Unit | Filter | sort', function() {
  test('it sorts function filters last', function(assert) {
    let fnFilter = Filter.create({ hasFnValue: true });
    let plainFilter = Filter.create();
    let filters = [fnFilter, plainFilter].sort(sortFilters);

    assert.equal(filters[0], plainFilter, 'The plain filter is sorted first');
  });
});
