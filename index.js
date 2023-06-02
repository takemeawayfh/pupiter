const fs = require('fs');
const { title } = require('process');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://habr.com/ru/all/', { timeout: 300000 });
    const titles = await page.evaluate(() => {
        const results = [];
        const items = document.querySelectorAll('a.tm-title__link');

        items.forEach(item => {
            results.push(item.innerText);
        });
        return results;
    });
    const op = await page.evaluate(() => {
        const res = [];
        const items = document.querySelectorAll('div.article-formatted-body');
        items.forEach(item => {
            res.push(item.innerText);
        });
        return res;
    });

    let html = '<ul>\n';
    titles.forEach((title, index) => {
        html += `  <li>${title}<br>${op[index]}</li>\n`;
    });
    html += '</ul>'; 
    fs.writeFile('index.html', html, err => {
        if (err) throw err;
        console.log('Сохранено в index');
    });

    await browser.close();
})();

async function getPic() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/index.html');
    await page.screenshot({ path: 'screenshot.png' });
    await browser.close();
}

getPic();
