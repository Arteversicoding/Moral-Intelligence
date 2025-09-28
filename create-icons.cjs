const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG template for the app icon
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
    </defs>
    
    <!-- Background circle -->
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="url(#grad1)" />
    
    <!-- Brain icon -->
    <g transform="translate(${size*0.2}, ${size*0.2}) scale(${size*0.6/100})">
        <!-- Left brain hemisphere -->
        <path d="M20 30 C15 25, 15 15, 25 10 C35 5, 45 10, 50 20 C50 25, 45 30, 40 35 C35 40, 25 40, 20 30 Z" 
              fill="white" opacity="0.9" stroke="white" stroke-width="2"/>
        
        <!-- Right brain hemisphere -->
        <path d="M50 20 C55 15, 65 15, 75 20 C85 25, 85 35, 80 40 C75 45, 65 45, 60 40 C55 35, 50 30, 50 20 Z" 
              fill="white" opacity="0.9" stroke="white" stroke-width="2"/>
        
        <!-- Brain details -->
        <circle cx="35" cy="25" r="3" fill="rgba(102,126,234,0.8)"/>
        <circle cx="65" cy="30" r="3" fill="rgba(102,126,234,0.8)"/>
        <path d="M30 35 Q40 30 50 35" stroke="rgba(102,126,234,0.8)" stroke-width="2" fill="none"/>
        <path d="M55 25 Q65 20 75 25" stroke="rgba(102,126,234,0.8)" stroke-width="2" fill="none"/>
    </g>
    
    <!-- Text "MI" at bottom -->
    <text x="${size/2}" y="${size*0.85}" text-anchor="middle" 
          font-family="Arial, sans-serif" font-size="${size*0.15}" font-weight="bold" fill="white">MI</text>
</svg>`;

// Icon sizes needed for PWA
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

console.log('🎨 Creating PWA icons...');

// Create SVG icons for each size
iconSizes.forEach(size => {
    const svgContent = createSVGIcon(size);
    const filename = `icon-${size}x${size}.svg`;
    const filepath = path.join(iconsDir, filename);
    
    fs.writeFileSync(filepath, svgContent.trim());
    console.log(`✅ Created ${filename}`);
});

// Create a simple PNG fallback using Canvas (if available) or provide instructions
const createPNGInstructions = () => `
# PNG Icon Generation Instructions

Since this is a Node.js script without canvas dependencies, here are the steps to create PNG icons:

## Option 1: Online Converter
1. Use the generated SVG files in the icons/ directory
2. Go to https://convertio.co/svg-png/ or similar online converter
3. Upload each SVG file and convert to PNG
4. Download and replace the SVG files with PNG versions

## Option 2: Using ImageMagick (if installed)
Run these commands in your terminal:

${iconSizes.map(size => 
    `magick icons/icon-${size}x${size}.svg icons/icon-${size}x${size}.png`
).join('\n')}

## Option 3: Using Sharp (Node.js)
Install sharp: npm install sharp
Then run this script with Sharp support enabled.

## Option 4: Manual Creation
1. Open any SVG file in a graphics editor (Inkscape, Adobe Illustrator, etc.)
2. Export as PNG with the corresponding dimensions
3. Save in the icons/ directory with the correct naming convention

The SVG files will work for most PWA implementations, but PNG is recommended for better compatibility.
`;

// Create instructions file
fs.writeFileSync(path.join(iconsDir, 'PNG_GENERATION_INSTRUCTIONS.txt'), createPNGInstructions());

// Create a simple favicon.ico instruction
const faviconInstructions = `
# Favicon Creation

To create a favicon.ico file:

1. Use the icon-32x32.svg or icon-16x16.svg
2. Convert to ICO format using:
   - Online converter: https://convertio.co/svg-ico/
   - Or use ImageMagick: magick icon-32x32.svg favicon.ico
3. Place the favicon.ico in the root directory of your website

Alternatively, you can use the PNG versions and link them in your HTML:
<link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png">
`;

fs.writeFileSync(path.join(iconsDir, 'FAVICON_INSTRUCTIONS.txt'), faviconInstructions);

// Create a sample screenshot template
const createScreenshotHTML = () => `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Screenshot Template - Moral Intelligence</title>
    <style>
        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
        }
        .logo {
            width: 120px;
            height: 120px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 60px;
            margin-bottom: 30px;
        }
        h1 {
            font-size: 48px;
            margin: 0 0 20px 0;
            font-weight: bold;
        }
        p {
            font-size: 24px;
            opacity: 0.9;
            margin: 0 0 40px 0;
        }
        .features {
            display: flex;
            gap: 30px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 15px;
            min-width: 200px;
        }
        .feature-icon {
            font-size: 30px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="logo">🧠</div>
    <h1>Moral Intelligence</h1>
    <p>Panduan bijak menghadapi remaja</p>
    
    <div class="features">
        <div class="feature">
            <div class="feature-icon">💬</div>
            <h3>Chat AI</h3>
            <p>Konsultasi cepat</p>
        </div>
        <div class="feature">
            <div class="feature-icon">👥</div>
            <h3>Forum</h3>
            <p>Diskusi komunitas</p>
        </div>
        <div class="feature">
            <div class="feature-icon">📚</div>
            <h3>Materi</h3>
            <p>Pembelajaran lengkap</p>
        </div>
    </div>
</body>
</html>
`;

// Create screenshot template
fs.writeFileSync(path.join(iconsDir, 'screenshot-template.html'), createScreenshotHTML());

console.log('✅ Created screenshot template');
console.log('✅ Created instruction files');
console.log('\n🎉 Icon generation completed!');
console.log('\nNext steps:');
console.log('1. Convert SVG files to PNG format (see PNG_GENERATION_INSTRUCTIONS.txt)');
console.log('2. Create favicon.ico (see FAVICON_INSTRUCTIONS.txt)');
console.log('3. Take screenshots using screenshot-template.html');
console.log('4. Update manifest.json if needed');

// Try to install sharp and generate PNGs automatically
try {
    const sharp = require('sharp');
    console.log('\n📸 Sharp detected! Generating PNG files...');
    
    const generatePNGs = async () => {
        for (const size of iconSizes) {
            try {
                const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
                const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
                
                await sharp(svgPath)
                    .resize(size, size)
                    .png()
                    .toFile(pngPath);
                
                console.log(`✅ Generated icon-${size}x${size}.png`);
            } catch (error) {
                console.log(`❌ Failed to generate icon-${size}x${size}.png:`, error.message);
            }
        }
        console.log('\n🎉 PNG generation completed!');
    };
    
    generatePNGs().catch(console.error);
    
} catch (error) {
    console.log('\n💡 Sharp not installed. SVG files created successfully.');
    console.log('   Install sharp for automatic PNG generation: npm install sharp');
}
