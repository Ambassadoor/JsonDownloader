const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 3001, // Use a different port to avoid conflict
    hot: true, // Enable hot module replacement
    proxy: [
      {
        context: ["/api", "/downloads"], // Define the context for proxying
        target: "http://localhost:3000", // Your Express server's port
        changeOrigin: true,
        pathRewrite: { "^/api": "" }, // This removes /api from the forwarded request
      },
    ],
  },
};
