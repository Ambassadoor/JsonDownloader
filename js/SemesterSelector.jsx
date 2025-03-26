const puppeteer = require("puppeteer");

const getSemesters = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://lipscomb.edu/academics/office-registrar/class-schedule");
    await page.waitForSelector("#main-content");

    // Get both tag name and text content in one pass.
    const elements = await page.$$eval("#main-content > h3, #main-content > p > a", els =>
      els.map(el => ({
        tag: el.tagName,
        text: el.textContent.trim(),
        link: el.href
      }))
    );

    const termMenu = [];
    let currentCategory = null;
    let termNames = [];

    for (const { tag, text, link } of elements) {
      if (tag === "H3") {
        // If there's an existing category, push it before starting a new one.
        if (currentCategory !== null) {
          termMenu.push({ termCategory: currentCategory, termNames });
        }
        currentCategory = text;
        termNames = [];
      } else if (tag === "A" && currentCategory !== null) {
        termNames.push({term: text, link: link});
      }
    }

    // Push the last category if present.
    if (currentCategory !== null) {
      termMenu.push({ termCategory: currentCategory, termNames });
    }

  } catch (err) {
    console.error("Error during scraping:", err);
  } finally {
    await browser.close();
  }
};

getSemesters();
