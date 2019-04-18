#! /usr/bin/env node
'use strict';

process.env.NODE_ENV = 'development';
const fs = require('fs-extra');
const webpack = require('webpack');
const devServer = require('webpack-dev-server');
const printErrors = console.error;
const clearConsole = require('react-dev-utils/clearConsole');

const { paths } = require('./utils/paths');

const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');

const logger = require('razzle-dev-utils/logger');


process.noDeprecation = true; // turns off that loadQuery clutter.

// Capture any --inspect or --inspect-brk flags (with optional values) so that we
// can pass them when we invoke nodejs
process.env.INSPECT_BRK = process.argv.find(arg => arg.match(/--inspect-brk(=|$)/)) || '';
process.env.INSPECT = process.argv.find(arg => arg.match(/--inspect(=|$)/)) || '';

function main() {
    // Optimistically, we make the console look exactly like the output of our
    // FriendlyErrorsPlugin during compilation, so the user has immediate feedback.
    // clearConsole();
    logger.start('Compiling...');

    // Delete assets.json to always have a manifest up to date
    fs.removeSync(paths.buildManifest);

    // Create dev configs using our config factory, passing in razzle file as
    // options.
    let clientConfig, serverConfig;

    if (fs.existsSync(paths.clientWebpackConfig)) {
        try {
            clientConfig = require(paths.clientWebpackConfig);
        } catch (e) {
            clearConsole();
            logger.error('Invalid webpack.client.config.js file.', e);
            process.exit(1);
        }
    }

    if (fs.existsSync(paths.serverWebpackConfig)) {
        try {
            serverConfig = require(paths.serverWebpackConfig);
        } catch (e) {
            clearConsole();
            logger.error('Invalid webpack.server.config.js file.', e);
            process.exit(1);
        }
    }

    // Compile our assets with webpack
    const clientCompiler = compile(clientConfig);
    const serverCompiler = compile(serverConfig);

    // Start our server webpack instance in watch mode after assets compile
    clientCompiler.plugin('done', () => {
        serverCompiler.watch(
            {
                quiet: true,
                stats: 'none'
            },
            /* eslint-disable no-unused-vars */
            stats => {}
        );
    });

    // Create a new instance of Webpack-dev-server for our client assets.
    // This will actually run on a different port than the users app.
    const clientDevServer = new devServer(clientCompiler, clientConfig.devServer);

    // Start Webpack-dev-server
    clientDevServer.listen((process.env.PORT && parseInt(process.env.PORT) + 1) || 3003, err => {
        if (err) {
            logger.error(err);
        }
    });
}

// Webpack compile in a try-catch
function compile(config) {
    let compiler;
    try {
        compiler = webpack(config);
    } catch (e) {
        printErrors('Failed to compile.', [e]);
        process.exit(1);
    }
    return compiler;
}

const run = async () => {
    const port = (process.env.PORT && parseInt(process.env.PORT)) || 3002;
    const portDev = (process.env.PORT_DEV && parseInt(process.env.PORT_DEV)) || port + 1;

    const actualPort = await choosePort(process.env.HOST, port);
    const actualPortDev = await choosePort(process.env.HOST, portDev);

    process.env.PORT = actualPort;
    process.env.PORT_DEV = actualPortDev;
};

run().then(main).catch(console.error);