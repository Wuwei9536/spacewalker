const path = require("path");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const baseWebpackConfig = require("./webpack.config.base");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

let webpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        terserOptions: {
          compress: {
            warnings: false,
            comparisons: false,
            drop_console: true,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          safe: true,
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new MiniCssExtractPlugin({
      filename: "public/styles/[name].[contenthash:8].css",
      chunkFilename: "public/styles/chunk.[name].[contenthash:8].css",
    }),
  ],
});

// 模块占用报告
if (process.env.npm_config_report) {
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

// 速度分析报告
if (process.env.npm_config_speed) {
  webpackConfig = smp.wrap(webpackConfig);
}

module.exports = webpackConfig;
