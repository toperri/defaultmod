# DefaultMod

Defaults editor for Mac.

Instead of using Electron, this app creates a server and opens your browser.

# How to open

*Before running, please download a TTF of the San Francisco font by Apple (not included for copyright reasons) and move it into the ```static``` folder with name ```sanfrancisco.ttf```*

```
cd /PATH/TO/DEFAULTMOD
npm install express
npm test
```

# Keybinds

Ctrl+M to modify field.

# Known issues

- DefaultMod doesn't support editing directly from the textbox.
- Some domains that are shown don't have any data. Can be resolved but at the cost of a less performant domain loading system.
