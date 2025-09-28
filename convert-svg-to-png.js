import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple SVG to PNG converter using Canvas (if available)
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

console.log('🎨 Converting SVG icons to PNG...');

// Create PNG icons with simple base64 encoded images
const createPNGIcon = (size) => {
    // Create a simple PNG data URL for the icon
    const canvas = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
        </defs>
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="url(#grad1)" />
        <g transform="translate(${size*0.2}, ${size*0.2}) scale(${size*0.6/100})">
            <path d="M20 30 C15 25, 15 15, 25 10 C35 5, 45 10, 50 20 C50 25, 45 30, 40 35 C35 40, 25 40, 20 30 Z" 
                  fill="white" opacity="0.9"/>
            <path d="M50 20 C55 15, 65 15, 75 20 C85 25, 85 35, 80 40 C75 45, 65 45, 60 40 C55 35, 50 30, 50 20 Z" 
                  fill="white" opacity="0.9"/>
            <circle cx="35" cy="25" r="3" fill="rgba(102,126,234,0.8)"/>
            <circle cx="65" cy="30" r="3" fill="rgba(102,126,234,0.8)"/>
        </g>
        <text x="${size/2}" y="${size*0.85}" text-anchor="middle" 
              font-family="Arial" font-size="${size*0.15}" font-weight="bold" fill="white">MI</text>
    </svg>`;
    
    return canvas;
};

// Try to use sharp if available
try {
    const { default: sharp } = await import('sharp');
    
    const convertWithSharp = async () => {
        for (const size of iconSizes) {
            try {
                const svgBuffer = Buffer.from(createPNGIcon(size));
                await sharp(svgBuffer)
                    .resize(size, size)
                    .png()
                    .toFile(path.join(__dirname, 'icons', `icon-${size}x${size}.png`));
                
                console.log(`✅ Created icon-${size}x${size}.png`);
            } catch (error) {
                console.log(`❌ Failed to create icon-${size}x${size}.png:`, error.message);
            }
        }
        console.log('🎉 PNG conversion completed with Sharp!');
    };
    
    convertWithSharp().catch(console.error);
    
} catch (error) {
    console.log('⚠️  Sharp not available, creating fallback PNG files...');
    
    // Fallback: Create simple PNG files by copying SVG content
    iconSizes.forEach(size => {
        try {
            const svgContent = createPNGIcon(size);
            const pngPath = path.join(__dirname, 'icons', `icon-${size}x${size}.png`);
            
            // For now, just copy the SVG as PNG (browsers can handle SVG in most cases)
            fs.writeFileSync(pngPath.replace('.png', '.svg'), svgContent);
            
            console.log(`✅ Created fallback for icon-${size}x${size}`);
        } catch (error) {
            console.log(`❌ Failed to create icon-${size}x${size}:`, error.message);
        }
    });
    
    console.log('\n💡 To create proper PNG files:');
    console.log('1. Install Sharp: npm install sharp');
    console.log('2. Or use online converter: https://convertio.co/svg-png/');
    console.log('3. Or open generate-png-icons.html in browser');
}
