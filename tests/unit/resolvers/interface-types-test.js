import {
  addInterfaceTypesToResolvers,
  composeCreateResolverByFields,
  composeCreateResolversForInterfaceTypes,
  resolveField,
  resolveInterfaceType
} from
  'ember-cli-mirage-graphql/resolvers/interface-types';
import { module, test } from 'qunit';

module('Unit | Resolvers | interface types', function() {
  module('add resolvers', function() {
    test('it adds resolvers for interface types', function(assert) {
      let name = 'foo';
      let interfaces = [{ name }];
      let resolvers = addInterfaceTypesToResolvers(interfaces);

      assert.equal(resolvers[name].__resolveType, resolveInterfaceType,
        'It added the resolver');
    });

    test('it can resolve and interface type', function(assert) {
      let key = 'foo';
      let data = { [key]: { __typename: null } };
      let type = {};
      let path = { key };
      let schema = { getType: () => type };
      let resolvedType = resolveInterfaceType(data, null, { path, schema });

      assert.equal(resolvedType, type, 'It resolves the type');
    });
  });

  module('create resolvers', function() {
    test('it creates resolvers by field', function(assert) {
      let data = {};
      let fieldName = 'foo';
      let resolveField = (_fieldName, _data) => {
        assert.equal(_fieldName, fieldName, 'It resolves by field name');
        assert.equal(_data, data, 'It receives the data');
      };
      let createByFields = composeCreateResolverByFields(resolveField);
      let resolver = createByFields({ [fieldName]: null });

      resolver[fieldName](data);
    });

    test('it creates resolvers', function(assert) {
      let addTypes = () => ({});
      let resolver = () => {};
      let createResolver = () => resolver;
      let createResolvers =
        composeCreateResolversForInterfaceTypes(addTypes, createResolver);
      let typeName = 'Foo';
      let _typeMap = {
        [typeName]: { name: typeName, _fields: {}, _interfaces: [{}] }
      };
      let resolvers = createResolvers({ _typeMap });

      assert.equal(resolvers[typeName], resolver, 'It created the resolver');
    });
  });

  module('field resolver', function() {
    test('it returns the field value', function(assert) {
      let fieldName = 'foo';
      let record = { [fieldName]: 'bar', __typename: 'Foo' };
      let fieldValue = resolveField(fieldName, record);

      assert.equal(fieldValue, record[fieldName], 'It resolved the field');
    });

    test('it works with wrapped field data', function(assert) {
      let fieldName = 'foo';
      let record = { data: { [fieldName]: 'bar', __typename: 'Foo' } };
      let fieldValue = resolveField(fieldName, record);

      assert.equal(fieldValue, record.data[fieldName], 'It resolved the field');
    });
  });
});
