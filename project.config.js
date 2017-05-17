﻿'use strict';

const path  = require('path');
const pkg   = require('./package.json');

const target = {
    type: 'library',
    es: 'es2015',
    module: 'commonjs',
    env: 'node',
};

const dir = {
    src: 'src',
    pkg: 'dist',
    built: 'built',
    doc: 'docs',
    task: 'tasks',
    test: 'tests',
    types: '@types',
};

const main = {
    namespace: 'cdp',
    basename: 'cdp-lib',
    bundle_d_ts: 'index.d.ts',
};

const d_ts_bundle = {
    name: pkg.name,
    main: path.join(dir.built, main.basename + '.d.ts'),
    baseDir: dir.built,
    out: path.join('..', dir.pkg, dir.types, pkg.name, main.bundle_d_ts),
    externals: false,
    verbose: false,
};

const banner = {
    fileName: 'BANNER',
    d_ts_desc: '\n * This file is generated by the CDP package build process.',
};

// project configuration
module.exports = {
    target: target,

    pkg: pkg,
    dir: dir,
    main: main,

    dts_bundle: d_ts_bundle,

    banner: banner,
};
