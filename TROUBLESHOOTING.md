# Troubleshooting Guide

## Connection Issues

### QR Code Not Scanning

**Problem:** Mobile phone cannot scan QR code

**Solutions:**
1. Increase screen brightness on TV
2. Move phone closer to screen (6-12 inches)
3. Ensure good lighting conditions
4. Try different QR scanner app
5. Manually type URL from QR code

### Controller Won't Connect

**Problem:** Mobile controller shows "Connecting..." indefinitely

**Solutions:**
1. Ensure both devices on same WiFi network
2. Refresh both TV and mobile pages
3. Clear browser cache and cookies
4. Check WebRTC support: `chrome://webrtc-internals`
5. Disable VPN or proxy
6. Try different browser
7. Check firewall settings

### Connection Drops Frequently

**Problem:** Controller disconnects during gameplay

**Solutions:**
1. Move closer to WiFi router
2. Use 5GHz WiFi instead of 2.4GHz
3. Reduce network traffic (pause downloads)
4. Close background apps on phone
5. Disable battery optimization for browser
6. Use wired connection for TV if possible

## Game Loading Issues

### Game Won't Load

**Problem:** Emulator shows error or black screen

**Solutions:**
1. Verify ROM file exists at specified path
2. Check ROM file format matches console
3. Ensure ROM file is not corrupted
4. Check browser console for errors (F12)
5. Try different ROM file
6. Clear browser cache
7. Check file size limits (GitHub Pages: 100MB)

### Emulator Core Not Loading

**Problem:** "Failed to load core" error

**Solutions:**
1. Check internet connection (cores load from CDN)
2. Verify core name in games.json matches EmulatorJS
3. Check browser console for 404 errors
4. Try different browser
5. Clear CDN cache
6. Check EmulatorJS documentation for core names

### ROM Path Errors

**Problem:** 404 error when loading ROM

**Solutions:**
1. Verify path in games.json is correct
2. Check file exists in roms directory
3. Ensure path is relative to index.html
4. Check file name case sensitivity
5. Verify file extension matches

## Performance Issues

### Input Lag

**Problem:** Delay between button press and game response

**Solutions:**
1. Use 5GHz WiFi
2. Reduce distance to router
3. Close other browser tabs
4. Disable browser extensions
5. Enable hardware acceleration
6. Reduce network traffic
7. Use wired connection for TV

### Low Frame Rate

**Problem:** Game runs slowly or choppy

**Solutions:**
1. Close other applications
2. Enable hardware acceleration in browser
3. Update graphics drivers
4. Try different browser (Chrome recommended)
5. Reduce browser zoom level
6. Check CPU usage
7. Try less demanding game/console

### Audio Issues

**Problem:** No sound or crackling audio

**Solutions:**
1. Check browser audio permissions
2. Unmute browser tab
3. Check system volume
4. Try different browser
5. Disable audio enhancements
6. Update audio drivers
7. Check emulator audio settings

## Display Issues

### UI Not Displaying Correctly

**Problem:** Layout broken or elements missing

**Solutions:**
1. Refresh page (Ctrl+F5 / Cmd+Shift+R)
2. Clear browser cache
3. Check browser console for errors
4. Verify TailwindCSS CDN is loading
5. Try different browser
6. Check screen resolution
7. Disable browser extensions

### QR Code Not Showing

**Problem:** QR code area is blank

**Solutions:**
1. Check browser console for errors
2. Verify qrcode.js is loading
3. Check internet connection
4. Try different browser
5. Manually share controller URL

### Game Screen Too Small/Large

**Problem:** Emulator display size incorrect

**Solutions:**
1. Adjust browser zoom (Ctrl+/- or Cmd+/-)
2. Enter fullscreen mode (F11)
3. Check CSS in browser DevTools
4. Modify emulator container size
5. Check TV display settings

## Mobile Controller Issues

### Buttons Not Responding

**Problem:** Tapping buttons has no effect

**Solutions:**
1. Check connection status at top
2. Verify player number is assigned
3. Refresh controller page
4. Reconnect by scanning QR again
5. Check browser console for errors
6. Try different browser on phone

### Touch Events Not Working

**Problem:** Buttons don't register touches

**Solutions:**
1. Disable browser gesture controls
2. Check touch event support
3. Try different mobile browser
4. Disable screen protector temporarily
5. Clean screen
6. Check for JavaScript errors

### Vibration Not Working

**Problem:** No haptic feedback on button press

**Solutions:**
1. Enable vibration in phone settings
2. Check browser permissions
3. Disable battery saver mode
4. Try different browser
5. Note: Not all browsers support vibration API

## Browser Compatibility

### WebRTC Not Supported

**Problem:** "WebRTC not supported" error

**Solutions:**
1. Update browser to latest version
2. Use supported browser:
   - Chrome 90+
   - Firefox 88+
   - Safari 14+
   - Edge 90+
3. Enable WebRTC in browser settings
4. Check browser flags

### ES6 Modules Not Working

**Problem:** "Unexpected token import" error

**Solutions:**
1. Serve files via HTTP server (not file://)
2. Update browser
3. Check MIME types
4. Verify module syntax

## Deployment Issues

### GitHub Pages Not Working

**Problem:** Site not accessible after deployment

**Solutions:**
1. Wait 2-5 minutes after enabling Pages
2. Check repository is public
3. Verify branch and folder settings
4. Check for build errors
5. Verify index.html is in root
6. Check custom domain settings

### Assets Not Loading on GitHub Pages

**Problem:** 404 errors for CSS/JS/images

**Solutions:**
1. Use relative paths (not absolute)
2. Check file name case sensitivity
3. Verify files are committed
4. Check .gitignore isn't excluding files
5. Wait for deployment to complete
6. Clear CDN cache

### CORS Errors

**Problem:** "CORS policy" errors in console

**Solutions:**
1. Ensure all assets served from same origin
2. Use CDN URLs for external libraries
3. Check server CORS headers
4. Verify HTTPS is enabled

## Development Issues

### Local Server Not Working

**Problem:** Cannot access localhost

**Solutions:**
1. Check server is running
2. Verify port number
3. Try different port
4. Check firewall settings
5. Use 127.0.0.1 instead of localhost

### Changes Not Reflecting

**Problem:** Code changes don't appear

**Solutions:**
1. Hard refresh (Ctrl+F5 / Cmd+Shift+R)
2. Clear browser cache
3. Disable browser cache in DevTools
4. Check file is saved
5. Verify correct file is being edited
6. Restart local server

## Advanced Debugging

### Enable Verbose Logging

Add to tv.js or controller.js:

```javascript
// Enable debug mode
window.DEBUG = true;

// Log all WebRTC events
webrtc.onMessage((peerId, data) => {
    if (window.DEBUG) {
        console.log('[WebRTC]', peerId, data);
    }
});
```

### Check WebRTC Stats

Chrome: `chrome://webrtc-internals`
Firefox: `about:webrtc`

Look for:
- Connection state
- ICE candidates
- Data channel state
- Bytes sent/received

### Monitor Network Traffic

1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check for:
   - Failed requests (red)
   - Slow requests (timing)
   - Large files (size)

### Check Console Errors

1. Open DevTools (F12)
2. Go to Console tab
3. Look for:
   - Red errors
   - Yellow warnings
   - Network errors
   - JavaScript exceptions

## Getting Help

If issues persist:

1. Check browser console for errors
2. Test on different device/browser
3. Verify all files are present
4. Check GitHub Issues
5. Review documentation
6. Test with minimal setup

## Common Error Messages

### "Session full"
- Maximum 4 players connected
- Wait for player to disconnect
- Restart game session

### "Invalid session"
- Session expired or doesn't exist
- Scan QR code again
- Restart game on TV

### "WebRTC connection failed"
- Network connectivity issue
- Check firewall/router settings
- Ensure same network
- Try different network

### "Failed to load ROM"
- ROM file missing or corrupted
- Check file path
- Verify file format
- Re-download ROM

### "Core not found"
- Invalid core name in games.json
- Check EmulatorJS documentation
- Verify CDN connectivity
- Update core name
