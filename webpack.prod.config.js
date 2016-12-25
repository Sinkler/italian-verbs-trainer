var webpack = require('webpack');
var path = require('path');

//noinspection JSUnresolvedVariable
var BUILD_DIR = path.resolve(__dirname, 'dist'),
    APP_DIR = path.resolve(__dirname, 'src/js');

//noinspection JSUnresolvedFunction
module.exports = {
    devtool: 'eval',
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    entry: path.resolve(APP_DIR, 'index.jsx'),
    output: {
        path: BUILD_DIR,
        filename: 'prod.js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                include: APP_DIR,
                loader: 'babel'
            }
        ]
    }
};
