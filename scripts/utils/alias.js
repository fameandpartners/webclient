const { srcPath } = require('./paths');

module.exports = {
    '@containers': srcPath('common/containers'),
    '@common': srcPath('common'),
    '@components': srcPath('common/components'),
    '@constants': srcPath('common/constants'),
    '@services': srcPath('common/services'),
    '@svg': srcPath('common/assets/svg'),
    '@scss': srcPath('common/assets/scss'),
    '@transforms': srcPath('common/transforms'),
    '@translations': srcPath('common/translations'),
    '@typings': srcPath('typings'),
    '@utils': srcPath('utils'),
    'webpack/hot/poll': require.resolve('webpack/hot/poll')
}