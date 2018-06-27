'use strict';

module.exports = {
  name: 'ember-cli-mirage-graphql',
  isProduction: false,

  included(parent) {
    this._super.included.apply(this, arguments);

    this.isProduction = parent.env === 'production';

    if (!this.isProduction) {
      this.import('vendor/-ember-cli-mirage-graphql-bundle.js');
      this.import('vendor/-ember-cli-mirage-graphql-shims.js');
    }
  },
  treeForAddon() {
    if (!this.isProduction) {
      return this._super.treeForAddon.apply(this, arguments);
    }
  },
  treeForVendor() {
    if (!this.isProduction) {
      const WebpackDependencyPlugin = require('./lib/webpack-dependency-plugin');

      return new WebpackDependencyPlugin({
        outputName: 'ember-cli-mirage-graphql',
        expose: ['graphql', 'graphql-tools']
      });
    }
  }
};
