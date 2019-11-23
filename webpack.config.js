const {join} = require(`path`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: join(__dirname, `public`)
  },
  devtool: `source-map`,
  devServer: {
    contentBase: join(__dirname, `public`),
    publicPath: `http://localhost:8080/`,
    compress: true,
    watchContentBase: true
  }
};