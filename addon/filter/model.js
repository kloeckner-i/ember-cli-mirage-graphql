import EmObject from '@ember/object';

export default EmObject.extend({
  fn: null,
  hasFnValue: false,
  named: null,
  resolvedName: null,
  value: null,

  init() {
    this.set('resolvedName', this.name);
  }
});
