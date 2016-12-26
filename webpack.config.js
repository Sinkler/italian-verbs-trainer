var Webpack = require('Webpack');
var Path = require('path');
var FileSystem = require("fs");

//noinspection JSUnresolvedVariable
var BUILD_DIR = Path.resolve(__dirname, 'dist');
//noinspection JSUnresolvedVariable
var APP_DIR = Path.resolve(__dirname, 'src/js');

//noinspection JSUnresolvedFunction,JSUnresolvedVariable
var config = {
    devtool: 'cheap-module-source-map',
    resolve: {
        extensions: ['', '.js']
    },
    entry: Path.resolve(APP_DIR, 'index.js'),
    output: {
        path: BUILD_DIR,
        filename: 'dev.js',
        publicPath: '/dist/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                include: [
                    APP_DIR,
                    FileSystem.realpathSync(__dirname + '/node_modules/fold-to-ascii/lib')
                ],
                loader: 'babel'
            }
        ]
    }
};

//noinspection JSUnresolvedVariable
if (process.env.production == "true") {
    //noinspection JSUnresolvedFunction
    config.plugins = [
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
    ];
    config.devtool = 'eval';
    config.output.filename = 'prod.js';
}

module.exports = config;
