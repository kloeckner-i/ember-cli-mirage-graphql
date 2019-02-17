import { composeFilterByParent, filterByParentField, getParentInfo } from
  'ember-cli-mirage-graphql/filter/parent';
import { module, test } from 'qunit';

module('Unit | Filter | parent', function() {
  module('get info', function() {
    test('it gets the parent field name and record', function(assert) {
      let parent = { field: { type: { name: 'Foo-Bar' } }, record: {} };
      let [fieldName, record] = getParentInfo(parent);

      assert.equal(fieldName, 'fooBar', 'It got the field name');
      assert.equal(record, parent.record, 'It got the record');
    });

    test('it gets relay edges parent field name and record', function(assert) {
      let isRelayEdges = true;
      let grandParent = { field: { type: { name: 'bar' } }, record: {} };
      let parent = { field: { parent: grandParent, type: { name: 'Foo-Bar' } } };
      let [fieldName, record] = getParentInfo(parent, isRelayEdges);

      assert.equal(fieldName, grandParent.field.type.name, 'It got the field name');
      assert.equal(record, grandParent.record, 'It got the record');
    });

    test('it works if not parent', function(assert) {
      let parent = {};
      let [fieldName, record] = getParentInfo(parent);

      assert.equal(fieldName, null, 'It returned no parent name');
      assert.equal(record, null, 'It returned no parent record');
    });

    test('it works if no grandparent', function(assert) {
      let isRelayEdges = true;
      let parent = {};
      let [fieldName, record] = getParentInfo(parent, isRelayEdges);

      assert.equal(fieldName, null, 'It returned no parent name');
      assert.equal(record, null, 'It returned no parent record');
    });
  });

  module('field', function() {
    test('it filters records by parent field', function(assert) {
      let parentFieldName = 'foo';
      let records = [
        { id: 1, [parentFieldName]: { id: 123 } },
        { id: 2, [parentFieldName]: { id: 321 } }
      ];
      let filteredRecords = filterByParentField(parentFieldName, 123, records);

      assert.deepEqual(filteredRecords, [records[0]], 'It filtered records');
    });
  });

  module('filter by', function() {
    test('it returns records, if no parent', function(assert) {
      let filterByParent = composeFilterByParent();
      let records = [];
      let filteredRecords = filterByParent(records, { field: {} });

      assert.equal(filteredRecords, records, 'It returned the records');
    });

    test('it filters records, if referenced by parent', function(assert) {
      let field = { parent: {} };
      let fieldName = 'bar';
      let records = [{ foo: 'bar' }, { foo: 'baz' }];
      let parentRecord = { id: 1, [fieldName]: records.slice(0, 1) };
      let getParentInfo = () => ([null, parentRecord]);
      let filterByParent = composeFilterByParent(getParentInfo);
      let filteredRecords = filterByParent(records, { field, fieldName });

      assert.deepEqual(filteredRecords, [records[0]], 'It returned the records');
    });

    test('it filters records that reference parent', function(assert) {
      let field = { parent: {} };
      let fieldName = 'bar';
      let records = [{ foo: 'bar' }, { foo: 'baz' }];
      let parentRecord = { id: 1 };
      let getParentInfo = () => ([null, parentRecord]);
      let filterByParentField = () => records.slice(0, 1);
      let filterByParent = composeFilterByParent(getParentInfo, filterByParentField);
      let filteredRecords = filterByParent(records, { field, fieldName });

      assert.deepEqual(filteredRecords, [records[0]], 'It returned the records');
    });
  });
});
