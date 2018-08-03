const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ReactRootPlugin = require('html-webpack-root-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
	console.info('Building webpack...', {mode: argv.mode});
	const isProduction = argv.mode === 'production';

	let devtool, devServer, plugins;

	plugins = [
		new HtmlWebPackPlugin({title: 'Open Record', hash: true}), // automatically create index.html based on webpack config
		new ReactRootPlugin() // create react root within generated html file
	];

	if (isProduction) {
		plugins.push(new UglifyJSPlugin(), new MiniCssExtractPlugin());
	} else {
		plugins.push(new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin());
		devtool = 'inline-source-map'; // enable web browser debugging
		devServer = {
			port: 8080,
			hot: true,
			historyApiFallback: true // Redirect to /index.html for 404s
		};
	}

	return {
		entry: ['babel-polyfill', './src/index.jsx'],
		module: {
			rules: [
				{
					test: /\.scss/,
					use: [
						isProduction ? MiniCssExtractPlugin.loader : 'style-loader', // creates style nodes from JS strings
						'css-loader', // translates CSS into CommonJS
						'sass-loader' // compiles Sass to CSS
					]
				},
				{
					test: /\.(svg|jpg)$/,
					loader: 'file-loader'
				},
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env', '@babel/preset-react'],
							plugins: ['@babel/plugin-proposal-class-properties', 'react-hot-loader/babel']
						}
					}
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/,
					use: ['file-loader']
				}
			]
		},
		resolve: {
			extensions: ['.js', '.jsx'] // load jsx files without including extension
		},
		externals: {
			config: JSON.stringify(require('config')) // Allow front-end to import config as "config"
		},
		plugins,
		devtool,
		devServer
	};
};
