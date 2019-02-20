import { composeGetTypeForInterface, composeGetTypeForField } from
  'ember-cli-mirage-graphql/fields/type';
import { module, test } from 'qunit';

module('Unit | Fields | type', function() {
  module('interface', function() {
    test('it gets the type for interfaces', function(assert) {
      let type = {};
      let typeName = 'Foo';
      let typeMap = { [typeName]: type };
      let interfaceValue = { typeCondition: { name: { value: typeName } } };
      let getTypeForInterface = composeGetTypeForInterface(() => interfaceValue);
      let interfaceType = getTypeForInterface({}, typeMap);

      assert.equal(interfaceType, type, 'It got the type');
    });
  });

  module('type for field', function() {
    test('it gets the type for a field', function(assert) {
      let getIsInterface = () => false;
      let getIsList = () => false;
      let getTypeForField = composeGetTypeForField(getIsList, getIsInterface);
      let type = {};
      let { isList, recordType } = getTypeForField(null, null, type);

      assert.equal(isList, false, 'Type is not a list type');
      assert.equal(recordType, type, 'The type is returned');
    });

    test('it gets the type for an interface type field', function(assert) {
      let getIsInterface = () => true;
      let getIsList = () => false;
      let type = {};
      let getTypeForInterface = () => type;
      let getTypeForField =
        composeGetTypeForField(getIsList, getIsInterface, getTypeForInterface);
      let { isList, recordType } = getTypeForField(null, null, type);

      assert.equal(isList, false, 'Type is not a list type');
      assert.equal(recordType, type, 'The concrete type is returned');
    });

    test('it gets the type for a list type field', function(assert) {
      let getIsInterface = () => false;
      let getIsList = () => true;
      let getTypeForField = composeGetTypeForField(getIsList, getIsInterface);
      let type = { ofType: {} };
      let { isList, recordType } = getTypeForField(null, null, type);

      assert.equal(isList, true, 'Type is not a list type');
      assert.equal(recordType, type.ofType, 'The concrete type is returned');
    });
  });
});
