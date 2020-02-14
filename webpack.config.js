const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const SitemapWebpackPlugin = require('sitemap-webpack-plugin').default

module.exports = {
    mode: 'development',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            hash: true,
            template: "src/index.html",
            excludeChunks: ['sw'],
            templateParameters: {
                'commitHash': process.env.COMMIT_HASH || 'dev',
                'buildDate': process.env.BUILD_DATE || '0000-00-00',
            }
        }),
        new MiniCssExtractPlugin(),
        new SitemapWebpackPlugin('https://taproom.us/', [ '/' ]),
    ],
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ],
            },
            {
                test: /\.jpg$/,
                use: [ 'file-loader' ],
            }
        ]
    },
    entry: {
        main: './src/index.js',
        sw: './src/sw.js',
    },
}
