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
    if (isEnvDevelopment) {

    }
    // ENV production on yarn build
    if (isEnvProduction) {
        config.entry = {
            'static/js/index': [
                path.join(appDirectory, 'src/index.js')
            ],
            'chrome-assets/content-scripts/index': [
                path.join(appDirectory, 'src/content-scripts/index.js')
            ]
        };

        config.output = {
            pathinfo: isEnvDevelopment,
            path: path.resolve(appDirectory, 'build'),
            filename: '[name].bundle.js',
            chunkFilename: 'static/js/[name].chunk.js',
        }

        config.optimization = {
            splitChunks: {
                chunks (chunk) {
                    // exclude all 
                    // https://webpack.docschina.org/plugins/split-chunks-plugin/#splitchunkschunks
                    return true;
                },
                name: false,
            },
            // runtimeChunk: {
            //     name: false
            // }
          }

        // 删除原有 HtmlWebpackPlugin 插件
        for (let i = 0; i < config.plugins.length; i++) {
            let item = config.plugins[i];
            if (item.constructor.toString().indexOf('class HtmlWebpackPlugin') > -1) {
                config.plugins.splice(i, 1);
            }
        }
        const plugins = [
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
                },
                // {
                //     from: "src/config/config.js",
                //     to: "chrome-assets/content-scripts",
                // },
            ]),
        ]
        // add CopyPlugin
        config.plugins.push(...plugins);
    }
    return config;
};
