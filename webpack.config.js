const webpack = require('webpack');
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	devtool: "source-map",

	plugins: [
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new webpack.ProvidePlugin({
			_: "lodash"
		}),
	],

	module: {
		rules: [
			{
				include: [path.resolve(__dirname, 'src')],
				loader: 'babel-loader',

				options: {
					plugins: ['syntax-dynamic-import', "@babel/plugin-transform-runtime"],

					presets: [
						[
							'@babel/preset-env',
							{
								modules: false
							}
						]
					],
				},

				test: /\.js$/
			},
			{
				test: /\.(scss|css)$/,

				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.ejs$/, loader: 'ejs-loader',
				options: {
					esModule: false,  // Set esModule to false
					variable: 'data'  // Set a variable name
				}
			},
			{
				test: /\.ejs$/,
				loader: 'html-loader',
			},
		]
	},

	output: {
		path: path.resolve(__dirname, 'public', 'dist'),
		chunkFilename: '[name].js',
		filename: '[name].js',
		publicPath: '/public/dist',
	},

	mode: 'development',

	devServer: {
		port: 8081,
		compress: true,
		proxy: {
			"/api": "http://localhost:8082"
		}
	}
};
