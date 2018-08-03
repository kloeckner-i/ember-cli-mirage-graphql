import EmObject from '@ember/object';

export default EmObject.extend({
  fn: null,
  hasFnValue: false,
  key: null,
  mappedKey: null,
  value: null,

  init() {
    this.set('mappedKey', this.key);
  }
});
