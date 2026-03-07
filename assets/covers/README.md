# Game Cover Images

Place game cover images in this directory.

## Naming Convention

Format: `{console}-{game}.jpg`

Examples:
- `nes-mario.jpg`
- `snes-marioworld.jpg`
- `gba-pokemon.jpg`
- `psx-tekken3.jpg`

## Recommended Dimensions

- Width: 300px
- Height: 400px
- Format: JPG or PNG
- Aspect Ratio: 3:4 (portrait)

## Sources

You can create placeholder images or use:
- Screenshots from games
- Box art (if legally owned)
- Custom artwork

## Placeholder Generation

If you don't have cover images, the UI will display a game controller emoji (🎮) as fallback.

To generate placeholders programmatically:

```javascript
// Create colored gradient placeholder
const canvas = document.createElement('canvas');
canvas.width = 300;
canvas.height = 400;
const ctx = canvas.getContext('2d');

const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, '#8B5CF6');
gradient.addColorStop(1, '#3B82F6');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 300, 400);

// Add game name
ctx.fillStyle = 'white';
ctx.font = 'bold 24px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('Game Name', 150, 200);

// Save as image
const dataUrl = canvas.toDataURL('image/jpeg');
```
