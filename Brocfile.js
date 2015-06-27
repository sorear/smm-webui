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

var workerJs = funnel(mergeTrees(['worker', 'smm/lib']), { exclude: ['main.js'] });

workerJs = esTranspiler(workerJs, { blacklist: ['es6.modules', 'useStrict'] });

workerJs = new ES6Modules(workerJs, {
    description: 'ES6: Worker Tree',
    esperantoOptions: {
        absolutePaths: true,
        strict: true,
    },
});

var replace = require('broccoli-string-replace');

workerJs = mergeTrees([
    workerJs,
    replace(funnel('bower_components/big-int/src', { include: ['BigInt.js'] }), {
        files: ['BigInt.js'],
        pattern: { match: /define\(factory\);/, replacement: 'define("BigInt",factory);' }, // hack to add module name
    }),
    funnel('bower_components/loader.js', { include: ['loader.js'] }),
    funnel('worker', { include: ['main.js'], getDestinationPath: function () { return 'main.defer'; } }),
]);

workerJs = app.concatFiles(workerJs, {
    inputFiles: ['loader.js', '**/*.js', 'main.defer'],
    outputFile: '/assets/worker.js',
    allowNone: true,
    description: 'Concat: Worker JS',
});

module.exports = app.toTree([workerJs]);
