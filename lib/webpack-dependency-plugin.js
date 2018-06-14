'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

/* eslint-disable node/no-extraneous-require, node/no-unpublished-require */
const Plugin = require('broccoli-plugin');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
/* eslint-enable node/no-extraneous-require, node/no-unpublished-require */

module.exports = class WebpackDependencyPlugin extends Plugin {
  constructor(options) {
    super([], {
      annotation: options.outputName,
      persistentOutput: true,
      needsCache: false
    });

    this.options = options;
  }

  build() {
    let outputFile = path.join(this.outputPath,
      `-${this.options.outputName}-bundle.js`);

    if (fs.existsSync(outputFile)) return;

    this._writeEntryFile();
    this._writeShims();

    return this._bundleLibraries();
  }

  _entryPath() {
    return path.join(this.outputPath, `-${this.options.outputName}-entry.js`);
  }

  _shimsPath() {
    return path.join(this.outputPath, `-${this.options.outputName}-shims.js`);
  }

  _writeEntryFile() {
    let libs = this.options.expose.map(lib => `'${lib}': require('${lib}')`);
    let contents = `module.exports = { ${libs.join(', ')} };`;

    fs.writeFileSync(this._entryPath(), contents, 'utf-8');
  }

  _writeShims() {
    let defines = this.options.expose.map(lib => `
      define('${lib}', ['-${this.options.outputName}-bundle'], (bundle) =>
        bundle['${lib}']
      );
    `);

    fs.writeFileSync(this._shimsPath(), defines.join(''), 'utf-8');
  }

  _bundleLibraries() {
    return new Promise((resolve, reject) => {
      webpack({
        entry: this._entryPath(),
        plugins: [
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(EmberApp.env())
          })
        ],
        output: {
          library: `-${this.options.outputName}-bundle`,
          libraryTarget: 'amd',
          path: this.outputPath,
          filename: `-${this.options.outputName}-bundle.js`
        }
      }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
};
