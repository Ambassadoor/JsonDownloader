const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

const downloadPath = path.resolve(__dirname, "..", "downloads");
const coursesFilePath = path.join(downloadPath, "courses.json");

const runPuppeteer = async () => {
  // Ensure the downloads directory exists
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath);
  }

  // Delete the existing file if it exists
  if (fs.existsSync(coursesFilePath)) {
    try {
      fs.unlinkSync(coursesFilePath);
      console.log(`Deleted old file: ${coursesFilePath}`);
    } catch (err) {
      console.error("Error deleting old file:", err);
      return; // Exit if we can't delete the old file
    }
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadPath,
  });

  await page.goto("https://courseschedule.lipscomb.edu/ScheduleP2024FALL.html");
  await page.waitForSelector("a.dt-button.buttons-json.buttons-jsonhtml5");
  await page.click("a.dt-button.buttons-json.buttons-jsonhtml5");

  console.log("Clicked download button, waiting for file...");

  // Set up a watcher
  const watcher = chokidar.watch(downloadPath, { persistent: true });

  // Wait for the file to be added
  const waitForFile = new Promise((resolve, reject) => {
    watcher.on("add", (downloadedFile) => {
      if (
        path.extname(downloadedFile) === ".json" &&
        !downloadedFile.includes(".crdownload")
      ) {
        console.log(`File added: ${downloadedFile}`);
        fs.rename(downloadedFile, coursesFilePath, (err) => {
          if (err) {
            console.error("Error renaming file:", err);
            reject(err);
          } else {
            console.log(`File successfully renamed to ${coursesFilePath}`);
            resolve();
          }
        });
      }
    });

    watcher.on("error", (error) => {
      console.error("Watcher error:", error);
      reject(error);
    });
  });

  try {
    await waitForFile;
  } catch (error) {
    console.error("Error waiting for file:", error);
  } finally {
    watcher.close();
    browser.close();
  }

  console.log("Cleanup completed successfully.");
};

runPuppeteer();
