const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const commonConfig = {
  mode: 'development',
  entry: {
    app: ['@babel/polyfill', path.join(process.cwd(), 'app', 'index.js')],
  },
  output: {
    publicPath: '',
    path: path.join(process.cwd(), 'dist'),
    libraryTarget: 'umd',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        include: path.join(process.cwd(), 'app'),
      },
      {
        test: /\.(css|less)$/,
        exclude: /(node_modules)/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              // ident: 'postcss',
              config: {
                // path: './'
              },
              // plugins: (loader) => {
              //   return [
              //     require('postcss-import')({ root: loader.resourcePath }),
              //     require('precss'),
              //     require('postcss-advanced-variables'),
              //     require('autoprefixer'),
              //     require('cssnano')({
              //       zindex: false,
              //     }),
              //   ];
              // },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|svg)$/,
        include: path.join(process.cwd(), 'app'),
        use: {
          loader: 'url-loader',
          options: {
            limit: 15000,
            name: '[name].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{
        from: 'app/i18n/lang',
        to: 'lang',
      }, {
        from: 'app/lib',
        to: 'lib',
      }],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(process.cwd(), 'app', 'index.html'),
      favicon: path.join(process.cwd(), 'app', 'static', 'images', 'favicon.ico'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.DefinePlugin({
      'process.env.URL_TYPE': JSON.stringify('dev-test'),
    }),
  ],
  resolve: {
    alias: {
      $components: path.join(process.cwd(), 'app', 'components'),
      $publicComponents: path.join(process.cwd(), 'app', 'publicComponents'),
      $config: path.join(process.cwd(), 'app', 'config'),
      $controllers: path.join(process.cwd(), 'app', 'controllers'),
      $consts: path.join(process.cwd(), 'app', 'consts'),
      $services: path.join(process.cwd(), 'app', 'services'),
      $store: path.join(process.cwd(), 'app', 'store'),
      $styles: path.join(process.cwd(), 'app', 'styles'),
      $static: path.join(process.cwd(), 'app', 'static'),
      $utils: path.join(process.cwd(), 'app', 'utils'),
      $decorators: path.join(process.cwd(), 'app', 'decorators'),
      $lib: path.join(process.cwd(), 'app', 'lib'),
      $utils: path.join(process.cwd(),'app','utils'),
    },
    extensions: ['.js', '.jsx'],
  },
};

const hostConfig = {
  'dev-online': 'https://www.kangbo.io',
  'dev-test': 'https://test.kangbo.io',
  'dev-backend': 'http://39.96.10.108',
};

const getDevelopmentConfig = (env) => merge([
  { mode: 'development' },
  { devtool: 'cheap-module-eval-source-map' },
  {
    devServer: {
      host: '127.0.0.1',
      port: 3001,
      contentBase: [
        path.join(__dirname, 'app'),
        path.join(__dirname, 'app', 'i18n'),
      ],
      proxy: {
        '/user': {
          target: hostConfig[env],
          changeOrigin: true,
          secure: false,
        },
        '/foundation': {
          target: hostConfig[env],
          changeOrigin: true,
          secure: false,
        },
        '/perpetual': {
          target: hostConfig[env],
          changeOrigin: true,
          secure: false,
        },
        '/wallet': {
          target: hostConfig[env],
          changeOrigin: true,
          secure: false,
        },
        '/exchange': {
          target: hostConfig[env],
          changeOrigin: true,
          secure: false,
        },
        '/otc': {
          target: hostConfig[env],
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },
]);

const getProductionConfig = () => merge([
  { mode: 'production' },
]);


module.exports = (env) => {
  switch (env) {
    case 'dev-backend':
    case 'dev-test':
    case 'dev-online':
      return merge(commonConfig, getDevelopmentConfig(env));
    default:
      return merge(commonConfig, getProductionConfig());
  }
};
