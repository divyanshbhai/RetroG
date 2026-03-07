# ROM Files Directory

Place your game ROM files in the appropriate subdirectories:

## Directory Structure

```
roms/
├── nes/          # Nintendo Entertainment System (.nes)
├── snes/         # Super Nintendo (.sfc, .smc)
├── gba/          # Game Boy Advance (.gba)
├── psx/          # PlayStation (.bin, .cue)
├── genesis/      # Sega Genesis (.bin, .md)
├── n64/          # Nintendo 64 (.n64, .z64)
├── gb/           # Game Boy (.gb)
└── gbc/          # Game Boy Color (.gbc)
```

## Legal Notice

You must own physical copies of all games you add to this directory. This platform is for personal use only.

## Adding ROMs

1. Place ROM file in appropriate directory
2. Update `games.json` with game metadata
3. Add cover image to `assets/covers/`
4. Commit and deploy

## Example

```bash
# Add NES game
cp mario.nes roms/nes/

# Update games.json
# Add entry for mario.nes

# Add cover
cp mario-cover.jpg assets/covers/nes-mario.jpg
```
