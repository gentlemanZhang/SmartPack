
const webpackMerge = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const webpackConfig = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ // 打包css文件
            filename: 'css/[name].css', //类似出口文件
        }),
    ]
}

// 打包分析
if (process.argv.slice(2).includes('--analyze')) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackMerge(common, webpackConfig);

