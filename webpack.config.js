const path = require( 'path' );
const basename = path.basename;
const { VueLoaderPlugin } = require( 'vue-loader' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const webpack = require( 'webpack' );
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const env = process.env.NODE_ENV;

module.exports = {
  mode: env || 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:' + 3000,
    'webpack/hot/only-dev-server',
    './src/main.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/wp-content/themes/' + basename(__dirname) + '/',
    filename: 'dist/[name].bundle.js',
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    }
  },
  plugins: [
    // make sure to include the plugin!
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin( {
      filename: 'dist/[name].css'
    } ),
    new UglifyJSPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader?minimize'
        ],
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {}
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: [ '*', '.js', '.vue', '.json' ]
  },
  performance: {
    hints: false
  },
  devtool: '#inline-source-map',
  devServer: {
    //contentBase: __dirname,
    publicPath: '/wp-content/themes/' + basename(__dirname) + '/',
    port: 3000,
    noInfo: true,
    historyApiFallback: true,
    hot: true,
    quiet: false,
    stats: {colors: true},
    proxy: {
      '**': {
        target: {
          protocol: 'http:',
          host: '0.0.0.0',
          port: 8089
        },
      },
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat( [
    new webpack.DefinePlugin( {
      'process.env': {
        NODE_ENV: '"production"'
      }
    } ),
  ] )
}
