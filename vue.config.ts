const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob-all');
const path = require('path');

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@components': path.resolve(__dirname, './src/components'),
                '@state_management': path.resolve(__dirname, './src/state_management'),
                '@': path.resolve(__dirname, 'src'),
            }
        },
        plugins: [
            new PurgecssPlugin({
                paths: glob.sync([
                    path.join(__dirname, './public/index.html'),
                    path.join(__dirname, './src/**/*.vue'),
                    path.join(__dirname, './src/**/*.ts'),
                    path.join(__dirname, './src/**/*.tsx'),
                ]),
                extractors: [
                    {
                        extractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
                        extensions: ['html', 'vue', 'ts', 'tsx']
                    }
                ],
            })
        ]
    }
};
