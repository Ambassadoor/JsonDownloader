// scrapeTable.js
const puppeteer = require('puppeteer');

// Retrieves table from user selected page
async function scrapeTable(targetUrl) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Go to the course schedule page
  await page.goto(targetUrl, {
    waitUntil: 'networkidle2',
  });

  // Wait for the table to load
  await page.waitForSelector('#table');

  // Extract the DataTable contents
  const { columns, rows } = await page.evaluate(() => {
    const dt = $('#table').DataTable();

    const columns = dt.settings()[0].aoColumns.map(col => col.sTitle.trim());

    const rows = dt.data().toArray();

    return {columns, rows};
;
  });

  await browser.close();

  const formatted = rows.map(row => {
    const obj = {};
    columns.forEach((col, index) => {
      obj[col] = row[index];
    });
    return obj;
  });   

  return formatted;
}

module.exports = { scrapeTable };
