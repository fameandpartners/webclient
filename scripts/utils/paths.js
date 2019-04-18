const path = require('path');

const root = path.join(__dirname, '../../');

function srcPath(subdir) {
    return path.join(root, 'src', subdir);
}

function rootPath(subdir) {
    return path.join(root, subdir);
}

const resolveFile = relativePath => path.resolve(root, relativePath);

const paths = {
    public: rootPath('public'),
    build: rootPath('build'),
    buildPublic: rootPath('build/public'),
    buildManifest: rootPath('build/assets.json'),
    src: rootPath('src'),
    nodeModules: rootPath('node_modules'),

    clientWebpackConfig: resolveFile('webpack.client.config.js'),
    serverWebpackConfig: resolveFile('webpack.server.config.js'),

    packageJson: resolveFile('package.json')
};

function getClientEnvironment(target) {
    const raw = Object.keys(process.env).reduce(
        (env, key) => {
            env[key] = process.env[key];
            return env;
        },
        {
            // Useful for determining whether we’re running in production mode.
            // Most importantly, it switches React into the correct mode.
            NODE_ENV: process.env.NODE_ENV || 'development',
            PORT: process.env.PORT || 3002,
            VERBOSE: !!process.env.VERBOSE,
            HOST: process.env.HOST || 'localhost',
            ASSETS_MANIFEST: paths.buildManifest,
            BUILD_TARGET: target === 'web' ? 'client' : 'server',
            // only for production builds. Useful if you need to serve from a CDN
            PUBLIC_PATH: process.env.PUBLIC_PATH || '/',
            // The public dir changes between dev and prod, so we use an environment
            // variable available to users.
            PUBLIC_DIR: process.env.NODE_ENV === 'production' ? paths.buildPublic : paths.public
        }
    );

    return { raw: raw || {} };
}

const stringified = raw =>
    Object.keys(raw).reduce((env, key) => {
        env[`process.env.${key}`] = JSON.stringify(raw[key]);
        return env;
    }, {});

module.exports = {
    getClientEnvironment,
    paths,
    stringified,
    srcPath
};
