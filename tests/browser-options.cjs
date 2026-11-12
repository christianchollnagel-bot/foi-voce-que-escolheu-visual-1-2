const fs=require('node:fs');
// Sem caminho local, o Playwright usa o Chromium instalado por `npx playwright install`.
const windowsChrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
exports.chromeExecutable=process.env.CHROME_PATH||(process.platform==='win32'&&fs.existsSync(windowsChrome)?windowsChrome:undefined);
