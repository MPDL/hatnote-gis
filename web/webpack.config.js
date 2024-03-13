const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env) => {
    return [
        Object.assign({}, common(env), frontend(env)),
        Object.assign({}, common(env), backend)
    ];
}

const common = (env) => {
    return {
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
                },
            ],
        },
        plugins: [
            new Dotenv({
                defaults: './.env.defaults',
                path: './.env.' + env.HATNOTE_GIS_ENV
            }),
        ],
        resolve: {
            extensions: ['*', '.js', '.jsx'],
        },
    }
};


const backend = {
    entry: [
        './src/server.js'
    ],
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
    },
    target: 'node',
}

const frontend = (env) => {
    return {
        entry: './src/index.js',
        devtool: 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: '[path][name][ext]'
                    }
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: '[path][name][ext]'
                    }
                },
                {
                    test: /\.(ogg|mp3|wav)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: '[path][name][ext]'
                    }
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Bloxberg world map editor",
                favicon: "./public/favicon.ico",
                meta: {
                    title: "Bloxberg world map editor",
                    description: "Editor to manage the mapping of the bloxberg validators to their world locations.",
                    keywords: "bloxberg, worldmap, crud",
                    author: "Felix Riehm",
                    'theme-color': "#1c2733"
                },
                minify: false
            }),
            new Dotenv({
                defaults: './.env.defaults',
                path: './.env.' + env.HATNOTE_GIS_ENV
            }),
        ],
        output: {
            filename: 'bundle.js',
            publicPath: getBasePath(env),
            path: path.resolve(__dirname, 'dist'),
        },
        resolve: {
            extensions: ['*', '.js', '.jsx'],
        },
    }
}

const getBasePath = (env) => {
    switch (env.HATNOTE_GIS_ENV) {
        case 'production':
            return '/gis/'
        case 'development.local':
            return '/'
        case 'staging':
            return '/gis/staging/'
        default:
            return '/'
    }
}