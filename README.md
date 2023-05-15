<br/>
<p align="center">
  <img src="https://raw.githubusercontent.com/Luke-G-Cordova/BetterSearch/master/static/icons/logo_color.svg" alt="BetterSearch Logo">
</p>
<h1 align="center">BetterSearch</h1>
<p align="center">Enables better web page searching functionality for browsers.</p>

# How to use

Currently BetterSearch is not deployed. To use it, you must build from source and add it to your extension list manually as follows:

### Clone the repository locally.

[Git clone docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) | [Git tutorial](https://www.w3schools.com/git/default.asp)

`$ git clone https://github.com/Luke-G-Cordova/BetterSearch.git`

### Install the npm packages.

[Npm install docs](https://docs.npmjs.com/cli/v8/commands/npm-install) | [Node.js tutorial](https://www.w3schools.com/nodejs/default.asp)

`$ npm install`

> Make sure you cd into your newly created repository first.

### Build.

This command builds the project in a folder called `dist`

`$ npm run build`

### Add to Chrome.

[Chrome docs](https://support.google.com/chrome/a/answer/2714278?hl=en#:~:text=Go%20to%20chrome%3A%2F%2Fextensions,the%20app%20or%20extension%20folder.)

- Open Chrome and type `chrome://extensions/` into the search bar.
- When open click the Developer mode toggle to toggle it ON in the top right corner.
- Click Load unpacked in the top left corner.
- Navigate to and select your `dist` folder and click open.
- It is now added to chrome. The keybinds to open the extension are sometimes finicky so click the hamburger icon in the top left and select keyboard shortcuts to make sure one is set for `Toggles the dom based popup`.
- To test out your new extension, access or reload a website and use your keyboard shortcut.

# Contributing

If you have a good idea or found a bug, make an issue for it! Feel free to clone the repository and submit a pull request as well!
