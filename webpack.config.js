const HtmlWebpackPlugin = require("html-webpack-plugin");
// const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin")
const { ModuleFederationPlugin } = require('webpack').container;

const deps = require('./package.json').dependencies;

module.exports = {
    output: {
        publicPath: "http://localhost:3001/",
    },
    // cache: false,
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", ".json"]
    },

    devServer: {
        port: 3001,
        historyApiFallback: true,
    },

    module: {
        rules: [
            {
                test: /\.(css|s[ac]ss)$/,
                exclude: /node_modules/,
                use: ["style-loader",  "css-loader", "postcss-loader"]
            },
            {
                test: /\.(ts|tsx |js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    }
                }
            },
        ],
    },

    plugins: [
        new ModuleFederationPlugin({
            name: "about",
            filename: "remoteEntry.js",
            remotes: {
               home: "home@http://localhost:3000/remoteEntry.js" 
            },
            exposes: {}, 
            shared: {
                ...deps,
                react: {
                    singleton: true,
                    requiredVersion: deps.react,
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: deps["react-dom"],
                },
            },
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        })
    ],
}