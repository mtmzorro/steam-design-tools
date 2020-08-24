// react-app-rewired
// https://github.com/timarney/react-app-rewired/blob/master/README_zh.md
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());

module.exports = function override(config, env) {
    const isEnvDevelopment = env === 'development';
    const isEnvProduction = env === 'production';

    // ENV development on yarn start
    if (isEnvDevelopment) { }
    // ENV production on yarn build
    if (isEnvProduction) {
        // 新增 chrome content-scripts 入口
        config.entry = {
            'static/js/index': [
                path.join(appDirectory, 'src/index.js')
            ],
            'chrome-assets/content-scripts/index': [
                path.join(appDirectory, 'src/content-scripts/index.js')
            ]
        };

        // 修改 出口
        config.output = { ...config.output, ...{
            pathinfo: isEnvDevelopment,
            path: path.resolve(appDirectory, 'build'),
            filename: '[name].bundle.js',
            chunkFilename: '[name].chunk.js',
        }};
        
        // 多出口，chrome 扩展中和 react 中不能共享 chunks，需要关闭 splitChunks
        // https://webpack.docschina.org/plugins/split-chunks-plugin/#splitchunkschunks
        delete config.optimization.splitChunks;
        delete config.optimization.runtimeChunk;

        // 删除 原有 HtmlWebpackPlugin、ManifestPlugin、GenerateSW
        const pluginsFilted = config.plugins.filter((item) => {
            const constructorStr = item.constructor.toString();
            const isTargetPlugin =
                constructorStr.indexOf('class HtmlWebpackPlugin') > -1 ||
                constructorStr.indexOf('ManifestPlugin') > -1 ||
                constructorStr.indexOf('class GenerateSW') > -1;
            return isTargetPlugin ? false : true;
        });
        config.plugins = [ ...pluginsFilted ];

        // 配置 plugins
        const plugins = [
            // 新增 HtmlWebpackPlugin
            new HtmlWebpackPlugin(
                Object.assign(
                    {},
                    {
                        inject: true,
                        chunks: ['static/js/index'],
                        template: path.join(appDirectory, 'public/index.html'),
                    },
                    isEnvProduction
                    ? {
                        minify: {
                            removeComments: true,
                            collapseWhitespace: true,
                            removeRedundantAttributes: true,
                            useShortDoctype: true,
                            removeEmptyAttributes: true,
                            removeStyleLinkTypeAttributes: true,
                            keepClosingSlash: true,
                            minifyJS: true,
                            minifyCSS: true,
                            minifyURLs: true,
                        },
                    }
                    : undefined
                )
            ),
            new CopyPlugin([
                {
                    from: "src/content-scripts/sdt.css",
                    to: "chrome-assets/content-scripts",
                },
                {
                    from: "src/content-scripts/background.js",
                    to: "chrome-assets/content-scripts",
                }
            ]),
        ]
        // add CopyPlugin
        config.plugins.push( ...plugins );
    }
    return config;
};
