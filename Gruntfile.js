module.exports = function (grunt) {

  const webpack = require("webpack");
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: ['dist', 'target'],

    webpack: {
      options: {
        entry: "./src/main.js",
        output: {
          path: __dirname,
          filename: "target/main.js"
        },
        module: {
          loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          }]
        },
        plugins: [
          // new webpack.optimize.UglifyJsPlugin({
          //   compress: {
          //     warnings: false
          //   }
          // })
        ]
      },
      build: {
        // configuration for this build
      }
    },

    copy: {
      main: {
        expand: true,
        cwd: 'target',
        src: 'main.js',
        dest: 'C:\\Users\\MattL\\AppData\\Local\\Screeps\\scripts\\screeps.com\\simple-screeps',
      },
    },

    watch: {
      files: ['src/**/*.js'],
      tasks: ['default']
    }
  });

  grunt.registerTask('default', ['clean', 'webpack', 'copy']);

};
