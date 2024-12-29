const path = require('path'); //required to create absolute path

const postCSSPlugins = [
    require("postcss-simple-vars"), 
    require("postcss-nested"), 
    require("autoprefixer")
];

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: { // your root file
        main: path.resolve(__dirname, './src/index.js'),
      },
	output: { // output JS bundle to: build/bundle.js
		path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js', 
        publicPath: ''
	},
    mode: 'development',
    devServer: {
        port: 9001,
        static: {
            directory: path.resolve(__dirname, './dist'),
        },
        devMiddleware: {
            index: 'index.html',
            writeToDisk: true
        }
        //publicPath: '/static/',
    },
    module: { // rules and loaders for asset files
        rules: [
            {
                test: /\.(png|jpg)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 3 * 1024
                    }
                }
            },
            {
                test: /\.txt/,
                type: 'asset/source'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    { 
                        loader: "css-loader", 
                        options: { url: false } 
                    },
                    { 
                        loader: "postcss-loader", 
                        options: 
                        { postcssOptions: { plugins: postCSSPlugins } } 
                    }
                ]
            },
            { // transpile ES6/7 to ES5 via babel
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/env' ],
                        plugins: [ '@babel/plugin-transform-class-properties' ]
                    }
                }
            },
            {
                test: /\.hbs$/,
                use: [
                    'handlebars-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({ 
            cleanOnceBeforeBuildPatterns: [
                '**/*', // cleans(removes files) in output directory
               // path.join(process.cwd(), 'build/**/*') // cleans specified directory
            ]
        }),
        new HtmlWebpackPlugin({
            title: "Webpack-PostCSS-Handlebars",
            template: path.join(__dirname, "src/index.hbs"),
            description: 'Some description',
            inject: "body",
            hash: false
        }),
    ]
};