// react-app-rewired 
// https://github.com/timarney/react-app-rewired/blob/master/README_zh.md
const CopyPlugin = require('copy-webpack-plugin');

module.exports = function override(config, env) {
    // ENV development on yarn start
    // if (env === 'development') {
    // }
    // ENV production on yarn build
    if (env === 'production') {
        // add CopyPlugin
        config.plugins.push(
            new CopyPlugin([
                { from: 'src/content-scripts', to: 'chrome-assets/content-scripts' },
                { from: 'src/config/config.js', to: 'chrome-assets/content-scripts' }
            ])
        )
    }
    return config;
}