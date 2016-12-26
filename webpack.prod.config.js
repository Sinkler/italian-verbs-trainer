var Webpack = require('Webpack');
var Path = require('path');
var FileSystem = require("fs");

//noinspection JSUnresolvedVariable
var BUILD_DIR = Path.resolve(__dirname, 'dist'),
    APP_DIR = Path.resolve(__dirname, 'src/js');

//noinspection JSUnresolvedFunction
module.exports = {
    devtool: 'eval',
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    entry: ['babel-polyfill', Path.resolve(APP_DIR, 'index.jsx')],
    output: {
        path: BUILD_DIR,
        filename: 'prod.js',
        publicPath: '/dist/'
    },
    plugins: [
        new Webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        function() {
            this.plugin("done", function(statsData) {
                var stats = statsData.toJson();
                if (!stats.errors.length) {
                    var htmlFileName = "index.html";
                    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
                    var html = FileSystem.readFileSync(Path.join(__dirname, htmlFileName), "utf8");
                    var htmlOutput = html.replace(/(["']).js\?([\w\d]+)/i, '$1.js?' + stats.hash);
                    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
                    FileSystem.writeFileSync(Path.join(__dirname, htmlFileName), htmlOutput);
                }
            });
        }
    ],
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
