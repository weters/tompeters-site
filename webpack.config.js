const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const SitemapWebpackPlugin = require('sitemap-webpack-plugin').default
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: 'development',
    output: {
        publicPath: "/",
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            hash: true,
            template: "src/index.html",
            filename: "index.html",
            chunks: ['main'],
            templateParameters: {
                'version': process.env.VERSION || 'v0-deadbeef',
            }
        }),
        new HtmlWebpackPlugin({
            hash: true,
            template: "src/404.html",
            filename: "404.html",
            chunks: ['notFound'],
        }),
        new MiniCssExtractPlugin(),
        new SitemapWebpackPlugin('https://tompeters.me/', [ '/' ]),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'public'},
            ],
        }),
    ],
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpg|png)$/,
                type: 'asset/resource'
            },
        ],
    },
    entry: {
        main: './src/index.js',
        notFound: './src/404.js',
        sw: './src/sw.js',
    },
}
