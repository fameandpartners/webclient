import path from 'path';
import fs from 'fs';

const TS_CONFIG = path.join(__dirname, 'tsconfig.json');
const RAZZLE_CONFIG = path.join(__dirname, 'razzle.config.js');
const PACKAGE_CONFIG = path.join(__dirname, 'package.json');
const STORYBOOK_WEBPACK = path.join(__dirname, '.storybook', 'webpack.config.js');

// Node resolves argv 0 and 1
const ARGV_ALIAS_NAME = 2;
const ARGV_ALIAS_PATH = 3;

async function addAlias(name, path) {
    // TODO: Figure out how to parse .js files cleanly
    try {
        // Read configs
        const tsConfig = JSON.parse(await fs.readFile(TS_CONFIG));
        const packageConfig = JSON.parse(await fs.readFile(PACKAGE_CONFIG));

        // Add it to the configs
        tsConfig.compilerOptions.paths[`@${name}/*`] = `${path}/*`;
        packageConfig.jest.moduleNameMapper[`^@${name}(.*)$`] = `<rootDir>/src/${path}$1`;

        // Write it back
        await fs.writeFile(TS_CONFIG, tsConfig);
        await fs.writeFile(PACKAGE_CONFIG, packageConfig);
    } catch (error) {
        console.error('Unable to parse due to', error, error.stack);
    }
}

const aliasName = process.argv[ARGV_ALIAS_NAME];
const aliasPath = process.argv[ARGV_ALIAS_PATH];

if (!aliasName || !aliasPath) {
    console.error('Please pass in the alias name and alias path assuming `src` is the root dir e.g. yarn run add:alias containers common/containers');
} else {
    console.log(`Adding alias for ${aliasName} => ${aliasPath}`);
    addAlias(aliasName, aliasPath);
}