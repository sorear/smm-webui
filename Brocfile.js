/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();
app.import('bower_components/bootstrap/dist/css/bootstrap.css');
app.import('bower_components/bootstrap/dist/css/bootstrap.css.map', {
        destDir: 'assets'
});
app.import('vendor/core.js/custom.js');
app.import('bower_components/bootstrap/dist/js/bootstrap.js');
app.import('bower_components/dompurify/purify.js');

var esTranspiler = require('broccoli-babel-transpiler');
var ES6Modules = require('broccoli-es6modules');
var mergeTrees = require('broccoli-merge-trees');
var funnel = require('broccoli-funnel');

// TODO: remove for/of from CEF, add a Map/Set/Promise polyfill (core.js ?)
var smmJs = esTranspiler('smm/lib', { modules: 'amdStrict', moduleId: true });
var replace = require('broccoli-string-replace');

smmJs = mergeTrees([
    smmJs,
    replace(funnel('bower_components/big-int/src', { include: ['BigInt.js'] }), {
        files: ['BigInt.js'],
        pattern: { match: /define\(factory\);/, replacement: 'define("BigInt",factory);' }, // hack to add module name
    }),
]);

app.trees.vendor = app.concatFiles(smmJs, {
    inputFiles: ['**/*.js'],
    outputFile: 'smm.js',
    allowNone: true,
    description: 'Concat: Worker JS',
});
app.legacyFilesToAppend.push('vendor/smm.js');

var symbols = funnel('bower_components/nm-metamath-symbols/symbols', { srcDir: '/', destDir: '/assets/symbols' });
symbols.description = 'symbols funnel';

module.exports = mergeTrees([app.toTree(), symbols]);
// do this at the absolute end to minimize the number of stages that are slowed down
module.exports.description = 'symbols merger';
