// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const cors = require("cors");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require("./webpack.config.js");

const app = express();
const compiler = webpack(webpackConfig);

app.use(express.json());
app.use(cors());
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  }),
);
app.use(webpackHotMiddleware(compiler));
app.use(express.static("public"));
app.use("/downloads", express.static(path.join(__dirname, "downloads")));

app.get("/api/check-download", async (req, res) => {
  const filePath = path.join(__dirname, "downloads", "courses.json");

  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const millisecondsElapsed = new Date() - new Date(stats.mtime);
      const hoursElapsed = millisecondsElapsed / (1000 * 60 * 60);

      if (hoursElapsed < Number(req.query.hours)) {
        return res.status(200).json({ status: "current" });
      }
    }

    exec(
      `node ${path.join(__dirname, "js", "downloader.js")}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).json({ status: "failed", message: stderr });
        }
        console.log(`stdout: ${stdout}`);
        res.status(200).json({ status: "updated" });
      },
    );
  } catch (error) {
    console.error("Error checking file:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
