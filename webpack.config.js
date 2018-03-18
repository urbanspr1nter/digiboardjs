var path = require('path');

var config = {
    entry: './main.js',
    output: {
       path: path.join(__dirname, '/'),
       filename: 'index.js',
    },
    mode: 'development',
    devServer: {
       inline: true,
       port: 8080
    },
    module: {
       rules: [
          {
             test: /\.jsx?$/,
             exclude: /node_modules/,
             use: {
                loader: 'babel-loader',
                options: {
                   presets: ['es2015', 'react']
                }
             }
          }
       ]
    }
 }
 module.exports = config;