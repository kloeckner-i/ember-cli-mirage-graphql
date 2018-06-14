import EmberObject from '@ember/object';

export default EmberObject.extend({
  alias: '',
  hasRelay: false,
  mirageType: null,
  records: null,
  type: null,

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
  }
});
