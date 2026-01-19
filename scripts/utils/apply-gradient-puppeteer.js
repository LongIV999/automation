const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function applyGradientBackground() {
  const browser = await puppeteer.launch({
    headless: 'new'
  });

  const page = await browser.newPage();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          width: 940px;
          height: 788px;
          overflow: hidden;
        }
        .container {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #F43F5E 0%, #FDA4AF 50%, #FFE4E6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .overlay-image {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 90%;
          max-height: 90%;
          width: auto;
          height: auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="file:///Users/admin/Desktop/Nail //Réel Vidéo Instagram conseils Marketing moderne et simple blanc  (Bài đăng Facebook).png" 
             alt="Reel Instagram" 
             class="overlay-image">
      </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  const outputPath = '/Users/admin/Desktop/Nail //Reel_Instagram_Gradient2_Pink.png';

  await page.screenshot({
    path: outputPath,
    type: 'png'
  });

  await browser.close();

  console.log('✅ Gradient background applied successfully!');
  console.log(`📁 Output: ${outputPath}`);
}

applyGradientBackground().catch(console.error);
