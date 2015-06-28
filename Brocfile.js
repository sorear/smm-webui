/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();
app.import('bower_components/bootstrap/dist/css/bootstrap.css');
app.import('bower_components/bootstrap/dist/css/bootstrap.css.map', {
        destDir: 'assets'
});
app.import('bower_components/bootstrap/dist/js/bootstrap.js');

var esTranspiler = require('broccoli-babel-transpiler');
var ES6Modules = require('broccoli-es6modules');
var mergeTrees = require('broccoli-merge-trees');
var funnel = require('broccoli-funnel');

var smmJs = esTranspiler('smm/lib', { blacklist: ['es6.modules', 'useStrict'] });

smmJs = new ES6Modules(smmJs, {
    description: 'ES6: SMM Tree',
    esperantoOptions: {
        absolutePaths: true,
        strict: true,
    },
});

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

module.exports = app.toTree();
