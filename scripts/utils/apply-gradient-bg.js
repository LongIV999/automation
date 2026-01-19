const sharp = require('sharp');
const path = require('path');

async function applyGradientBackground(inputPath, outputPath) {
  try {
    // Read original image
    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;

    // Create gradient SVG
    const gradientSvg = `
      <svg width="${width}" height="${height}">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#F43F5E;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#FDA4AF;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFE4E6;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradient)" />
      </svg>
    `;

    // Create gradient background
    const gradientBuffer = Buffer.from(gradientSvg);

    // Composite: gradient background + original image
    const result = await sharp(gradientBuffer)
      .composite([
        {
          input: await sharp(inputPath).resize(width, height, { fit: 'inside', withoutEnlargement: true }).toBuffer(),
          gravity: 'center'
        }
      ])
      .png()
      .toFile(outputPath);

    console.log('✅ Gradient background applied successfully!');
    console.log(`📁 Output: ${outputPath}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

const inputPath = '/Users/admin/Desktop/Nail //Réel Vidéo Instagram conseils Marketing moderne et simple blanc  (Bài đăng Facebook).png';
const outputPath = '/Users/admin/Desktop/Nail //Reel_Instagram_Gradient2_Pink.png';

applyGradientBackground(inputPath, outputPath);
