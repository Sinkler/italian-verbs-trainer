var Path = require('path');

//noinspection JSUnresolvedVariable
var BUILD_DIR = Path.resolve(__dirname, 'dist'),
    APP_DIR = Path.resolve(__dirname, 'src/js');

module.exports = {
    devtool: 'cheap-module-source-map',
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    entry: ['babel-polyfill', Path.resolve(APP_DIR, 'index.jsx')],
    output: {
        path: BUILD_DIR,
        filename: 'dev.js',
        publicPath: '/dist/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                include: APP_DIR,
                loader: 'babel',
                plugins: ['transform-runtime']
            }
        ]
    }
};
