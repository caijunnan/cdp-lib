﻿'use strict';

const pkg   = require('./package.json');

const target = {
    type: '<% projectType %>',
    es: '<% es %>',
    <%# module %>
    module: '<% module %>',
    <%/ module %>
    <%# env %>
    env: '<% env %>',
    <%/ env %>
};

const dir = {
    src: '<% structureConfig.src %>',
    pkg: '<% structureConfig.pkg %>',
    built: '<% structureConfig.built %>',
    doc: '<% structureConfig.doc %>',
    task: '<% structureConfig.task %>',
    test: '<% structureConfig.test %>',
    types: '<% structureConfig.types %>',
    temp: '<% structureConfig.temp %>',
    lib: '<% structureConfig.lib %>',
    external: '<% structureConfig.external %>',
    porting: '<% structureConfig.porting %>',
    res: '<% structureConfig.res %>',
    script: '<% structureConfig.srcConfig.script %>',
    stylesheet: '<% structureConfig.srcConfig.stylesheet %>',
    template: '<% structureConfig.srcConfig.template %>',
};

const external_rearrange = {
    ignore_modules: [
        '^cordova-',
    ],
    module_adjuster: {
        '@cdp/mobile': {
            vender: 'cdp',
            type: 'both',
            dev: 'cdp*.?(*js|*css)',
            prod: 'cdp*.min.?(*js|*css)',
            ignore: {
                dev: ['*.min.js', '*.min.css'],
            },
        },
        'requirejs': {
            cwd: '.',
            dev: 'require.js',
        },
        <%# hogan %>
        'hogan.js': {
            vender: 'hogan',
            rename: 'hogan',
            cwd: './dist',
            dev: 'hogan-*.amd.js',
            prod: 'hogan-*.min.amd.js',
            ignore: {
                dev: ['*.min.amd.js'],
            },
        },
        <%/ hogan %>
        <%# hammerjs %>
        'jquery-hammerjs': {
            vender: 'hammerjs',
        },
        <%/ hammerjs %>
        <%# iscroll %>
        'iscroll': {
            dev: 'iscroll-probe.js',
        },
        <%/ iscroll %>
    },
};

const built_cleanee = {
    ts: ['**/*.js', '**/*.map', `!${dir.external}/**`, `!${dir.res}/**`],
    scss: ['**/*.css', '**/*.map', `!${dir.external}/**`, `!${dir.res}/**`],
};

const build_settings = {
    copy_src: {
        dev_resource: ['samples'],
    },
    string_replace: {
        'release': {
            '%% build_setting %%': true,
        },
    },
    hook_scripts: {
        // called all files setup to pkg
        after_setup: {
            // <npm script name>: <need option argument>
        },
        // called after minfiy
        after_optimize: {
            // <npm script name>: <need option argument>
        },
    },
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
    external_rearrange: external_rearrange,
    built_cleanee: built_cleanee,
    build_settings: build_settings,
    banner: banner,
};