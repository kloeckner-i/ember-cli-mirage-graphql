import EmberObject from '@ember/object';
import { GraphQLList } from 'graphql';
import { camelize } from 'ember-cli-mirage/utils/inflector';

export default EmberObject.extend({
  alias: '',
  hasRelay: false,
  mirageType: null,
  records: null,
  returnType: null,
  type: null,

  init() {
    this._parseReturnType();
  },
  setAlias(alias) {
    return this.set('alias', alias);
  },
  setMirageType(mirageType) {
    return this.set('mirageType', mirageType);
  },
  setRecords(records) {
    return this.set('records', records);
  },
  setType(type) {
    return this.set('type', type);
  },
  _parseReturnType() {
    let returnType = this.get('returnType');
    let type = returnType instanceof GraphQLList
      ? returnType.ofType
      : returnType;

    this.setType(type);
    this.setMirageType(camelize(type.name));
  }
});
