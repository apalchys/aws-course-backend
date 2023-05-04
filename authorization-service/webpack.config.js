const { IgnorePlugin } = require('webpack');
const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
    entry: slsw.lib.entries,
    target: 'node',
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    optimization: {
        // We no not want to minimize our code.
        minimize: false
    },
    performance: {
        // Turn off size warnings for entry points
        hints: false
    },
    plugins: [
        new IgnorePlugin({
            checkResource(resource) {
                return (
                    /^pg-native$/.test(resource) ||
                    /^sqlite3$/.test(resource) ||
                    /^pg-query-stream$/.test(resource) ||
                    /^oracledb$/.test(resource) ||
                    /^better-sqlite3$/.test(resource) ||
                    /^tedious$/.test(resource) ||
                    /^mysql$/.test(resource) ||
                    /^mysql2$/.test(resource)
                );
            },
        })
    ],
    devtool: 'nosources-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            }
        ]
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
        sourceMapFilename: '[file].map'
    }
};
