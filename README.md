# DefaultMod

Defaults editor for Mac.

Instead of using Electron, this app creates a server and opens your browser.

# How to open

*Before running, please download a TTF of the San Francisco font by Apple (not included for copyright reasons) and move it into the ```static``` folder with name ```sanfrancisco.ttf```*

```sh
cd /PATH/TO/DEFAULTMOD
npm install express
npm test
```

# Keybinds

Ctrl+M to modify field.

# Known issues

- DefaultMod doesn't support editing directly from the textbox.
- Some app packets that are shown don't have any data. Can be resolved but at the cost of a less performant domain loading system.

# TO DO

- Encrypt data using AES or a custom crafted encryption method. (The way it would work is that the server would add into the HTML page the encryption key, so basically end-to-end encryption). This would delete support for multiple instances and page refreshing though.
- Add support for writing directly in the textbox and auto-saving in local storage.
- Encrypt the local storage with a key stored on the cookie.

# How to disable Dock protection (NOT RECCOMENDED)
The app automatically enables a layer of security for the Dock app packet, disallowing any modification besides removing the app packet entirely (which only resets the Dock to its default settings)

If you wish to disable the Dock protection added in the app, you may disable it via DevTools. **WE ARE NOT RESPONSIBLE FOR ANY DAMAGE THAT OCCURS WHEN MODIFYING THE DOCK APP PACKET OR ANY PACKET IN GENERAL.**

- Open DevTools.
- Go to console.
- Type in ```desecureDock()```.
- Press Enter.
- A window alert will notify you that the Dock protection was disabled.

  You can run this command to reenable the Dock protection:

```js
localStorage.setItem('dockSecured','true');
```
