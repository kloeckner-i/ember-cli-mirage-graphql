'use strict';

module.exports = {
  name: 'ember-cli-mirage-graphql',

  included() {
    this._super.included.apply(this, arguments);

    this.import('vendor/-ember-cli-mirage-graphql-bundle.js');
    this.import('vendor/-ember-cli-mirage-graphql-shims.js');
  },

  treeForVendor() {
    const WebpackDependencyPlugin = require('./lib/webpack-dependency-plugin');

    return new WebpackDependencyPlugin({
      outputName: 'ember-cli-mirage-graphql',
      expose: ['graphql', 'graphql-tools']
    });
  }
};
