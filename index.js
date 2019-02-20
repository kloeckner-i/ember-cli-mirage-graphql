'use strict';

module.exports = {
  appEnv: null,
  mirageConfig: null,
  name: require('./package').name,
  options: {
    autoImport: {
      webpack: {
        module: {
          rules: [
            /* fixes issue with graphql-js's mjs entry */
            /* see: https://github.com/graphql/graphql-js/issues/1272#issuecomment-393903706 */
            {
              test: /\.mjs$/,
              include: /node_modules\/graphql/,
              type: 'javascript/auto'
            }
          ]
        }
      }
    }
  },
  included(app) {
    let config = this.app.project.config(app.env);

    this.appEnv = app.env;
    this.mirageConfig = config['ember-cli-mirage'] || {};

    this._super.included.apply(this, arguments);
  },
  treeForAddon() {
    if (this._getShouldIncludeFiles()) {
      return this._super.treeForAddon.apply(this, arguments);
    }
  },
  _getShouldIncludeFiles() {
    if (process.env.EMBER_CLI_FASTBOOT) {
      return false;
    }

    let environment = this.appEnv;
    let enabledInProd = environment === 'production' && this.mirageConfig.enabled;
    let explicitExcludeFiles = this.mirageConfig.excludeFilesFromBuild;
    let shouldIncludeFiles = enabledInProd || (environment &&
      environment !== 'production' && explicitExcludeFiles !== true);

    return shouldIncludeFiles;
  }
};
