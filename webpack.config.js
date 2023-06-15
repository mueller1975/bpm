/**
 * Webpack Configuration
 */
const PATH_SEPARATOR = __dirname.includes('/') ? '/' : '\\';
const path = require('path')
const SRC = path.resolve(__dirname, 'src/main/resources/static')
const JSX = path.resolve(__dirname, 'jsx')
const JSX_LIB = `${JSX}/lib`
const DIST = `${SRC}/dist`
const PROJECT_NAME = __dirname.substring(__dirname.lastIndexOf(PATH_SEPARATOR) + 1)
const { ModuleFederationPlugin } = require('webpack').container;

const webpack = require('webpack')

/**
 * env.config: dev/prod
 * 
 * env.debug: true/false
 * 
 * eg. npx webpack --env.config=prod --env.debug=false
 */
module.exports = (env = {
    config: 'dev',
    debug: false
}) => {

    const [mode, watch] = env.debug ? ['development', true] : ['production', false];

    env = {
        debug: false,
        config: 'dev',
        ...env
    }

    console.log({ env, PROJECT_NAME })

    return {
        mode,
        watch,

        resolve: {
            alias: {
                Config$: `${JSX}/config/config.jsx`,
                Components$: `${JSX_LIB}/components.jsx`,
                Animations$: `${JSX_LIB}/animations.jsx`,
                Themes$: `${JSX_LIB}/themes.jsx`,
                Sounds$: `${JSX_LIB}/sounds.jsx`,
                Views$: `${JSX_LIB}/views.jsx`,
                Charts$: `${JSX_LIB}/charts.jsx`,
                Tools: `${JSX_LIB}/tools.js`,
                FileTools: `${JSX_LIB}/fileTools.js`,
                API: `${JSX}/api`,
                Container: `${JSX}/container`,
                Component: `${JSX}/component`,
                Context: `${JSX}/context`,
                Hook: `${JSX}/hook`,
                Reducer: `${JSX}/reducer`,
                Locale: `${JSX}/locale`,
                Template: `${JSX}/template`,
                Chart: `${JSX}/component/chart`,
                Animation: `${JSX}/component/animation`,
                Filter: `${JSX}/component/filter`,
            }
        },

        entry: {
            index: `${JSX}/page/index.jsx`,
        },

        output: {
            path: DIST, // 須為絕對路徑
            publicPath: 'dist/',
            filename: '[name].js',
            chunkFilename: '[name]-chunk.js?t=' + new Date().getTime(), // for cache busting
        },

        // optimization: {
        //     splitChunks: {
        //         chunks: "all",
        //         maxInitialRequests: Infinity,
        //         minSize: 0,
        //         cacheGroups: {
        //             reactVendor: {
        //                 test: /[\\/]node_modules[\\/]/,
        //                 name: "vendors",
        //                 chunks: "all"
        //             },
        //         }
        //     }
        // },

        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    'chrome': '95',
                                }
                            }],
                            '@babel/preset-react'
                        ],
                        plugins: [
                            // ['babel-plugin-styled-components', {
                            //     displayName: true,
                            //     fileName: true,
                            // }]
                        ]
                    }
                }]
            },

            {
                test: /\.(css|less)$/,
                // use: ['style-loader', 'css-loader', 'less-loader']
                use: ['style-loader', 'css-loader']
            },

            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            },

            // config.jsx 根據 env.config 值 import config-dev.jsx 或 config-prod.jsx
            {
                test: /config\.jsx/,
                use: [{
                    loader: 'webpack-preprocessor-loader',
                    options: {
                        debug: env.debug,
                        params: {
                            ENV: env.config,
                        },
                        verbose: false,
                    }
                }]
            }
            ]
        },

        plugins: [
            new webpack.DefinePlugin({
                ENV: JSON.stringify(env.config),
                PROJECT_NAME: JSON.stringify(PROJECT_NAME)
            }),

            // new ModuleFederationPlugin({
            //     name: 'host',
            //     remotes: {
            //       mpbForms: 'mpbForms@./resource/mpbForms',
            //     },
            //   }),
        ],

    }
}