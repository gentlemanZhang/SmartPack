const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

const config = merge.smart(baseConfig, {
    module: {
        rules: [
            // {
            //     enforce: 'pre',
            //     test: /\.jsx?$/,
            //     exclude: '/node_modules/',
            //     use: 'eslint-loader',
            // },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },
    devServer: {
        port: '1234',
        before(app) {
            app.get('/api/test.json', function (req, res) {
                res.json({ code: 200, message: 'hello world' })
            })
        }
    }
})

config.plugins.push(
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true),
    }) 
)
config.plugins.push(
    new webpack.NamedModulesPlugin(), //用于启动HMR时可以显示模块的相对路径
    new webpack.HotModuleReplacementPlugin(), //Hot Module Replacement的插件
)

module.exports = config