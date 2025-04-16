// scrapeTable.js
const puppeteer = require('puppeteer');

async function scrapeTable() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Go to the course schedule page
  await page.goto('https://courseschedule.lipscomb.edu/ScheduleP2025SUMMER.html', {
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

// Run the function or export for use in an API
scrapeTable().then(data => {
  console.log(JSON.stringify(data, null, 2));
}).catch(err => {
  console.error('Error:', err);
});
