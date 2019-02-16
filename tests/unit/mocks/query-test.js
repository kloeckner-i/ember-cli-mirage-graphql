import { composeMockQuery } from 'ember-cli-mirage-graphql/mocks/query';
import { module, test } from 'qunit';

module('Unit | Mocks | query', function() {
  let noop = () => {};
  let createFieldInfo = noop;
  let getTypeForField = noop;
  let fieldName = 'foo';
  let getFieldName = () => ({ fieldName });
  let meta = { fieldNodes: [], returnType: {}, schema: {} };
  let record = { [fieldName]: 'bar' };
  let resolveFieldInfo = () => record;

  test('it creates field info, resolves it and returns records', function(assert) {
    let getIsInterface = () => false;
    let mockQuery = composeMockQuery(getTypeForField, getFieldName,
      createFieldInfo, resolveFieldInfo, getIsInterface);
    let records = mockQuery(null, null, null, null, null, meta);

    assert.equal(records, record[fieldName], 'It returned the record');
  });

  test('it returns records wrapped, if interface type', function(assert) {
    let getIsInterface = () => true;
    let mockQuery = composeMockQuery(getTypeForField, getFieldName,
      createFieldInfo, resolveFieldInfo, getIsInterface);
    let records = mockQuery(null, null, null, null, null, meta);

    assert.equal(records, record, 'It returned the record');
  });

  test('it logs errors on catch', function(assert) {
    let message = 'error';
    let logError = (ex) =>
      assert.equal(ex.message, message, 'It caught the error');

    function getFieldName() {
      throw new Error(message);
    }

    let mockQuery = composeMockQuery(getTypeForField, getFieldName,
      createFieldInfo, resolveFieldInfo, null, logError);

    mockQuery(null, null, null, null, null, meta);
  });
});
