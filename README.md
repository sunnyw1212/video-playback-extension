# <img src="src/assets/img/icon128.png" width="64"/> Video Playback Extension

A full-featured video and audio player extension. Control playback speed, skipping, rewinding and more.

<img src="web-store-images/disneyplus1280x800.png" width="500"/>

## Features

Speed up, slow down, advance and rewind HTML5 audio/video elements either with shortcuts or using a clean, elegant interface.

Optimize your media experience by:

- customizing playback speed
- skipping forward or backward by custom time intervals
- looping
- restarting media from the very beginning
- playing
- pausing
- an experimental Theater Mode (for video only)

Once the extension is installed, navigate to any page with an HTML5 video or audio element and click on the extension to bring down the Player User Interface. Any changes made will affect all audio/video elements on the page and you can optionally control media across all tabs in Chrome using the Player UI.

Current Shortcuts (more on the way):

- CMD (CTRL on windows) + SHIFT + 1 = Decrease playback speed by .25
- CMD (CTRL on windows) + SHIFT + 2 = Increase playback speed by .25
- CMD (CTRL on windows) + SHIFT + Left Arrow = Skip backward by the Skip Interval set in the Player UI
- CMD (CTRL on windows) + SHIFT + Right Arrow = Skip forward by the Skip Interval set in the Player UI

## Local Development

### Installing and Running Procedures:

1. Check if your [Node.js](https://nodejs.org/) version is >= **14**.
2. Clone this repository.
3. Run `npm install` to install the dependencies.
4. Run `npm start`
5. Load your extension on Chrome following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.
6. Happy hacking.

## Structure

All your extension's code must be placed in the `src` folder.

## Webpack auto-reload and HRM

To make your workflow much more efficient this boilerplate uses the [webpack server](https://webpack.github.io/docs/webpack-dev-server.html) to development (started with `npm start`) with auto reload feature that reloads the browser automatically every time that you save some file in your editor.

You can run the dev mode on other port if you want. Just specify the env var `port` like this:

```
$ PORT=6002 npm run start
```

## Content Scripts

Although this boilerplate uses the webpack dev server, it's also prepared to write all your bundles files on the disk at every code change, so you can point, on your extension manifest, to your bundles that you want to use as [content scripts](https://developer.chrome.com/extensions/content_scripts), but you need to exclude these entry points from hot reloading [(why?)](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate/issues/4#issuecomment-261788690). To do so you need to expose which entry points are content scripts on the `webpack.config.js` using the `chromeExtensionBoilerplate -> notHotReload` config. Look the example below.

Let's say that you want use the `myContentScript` entry point as content script, so on your `webpack.config.js` you will configure the entry point and exclude it from hot reloading, like this:

```js
{
  …
  entry: {
    myContentScript: "./src/js/myContentScript.js"
  },
  chromeExtensionBoilerplate: {
    notHotReload: ["myContentScript"]
  }
  …
}
```

and on your `src/manifest.json`:

```json
{
  "content_scripts": [
    {
      "matches": ["https://www.google.com/*"],
      "js": ["myContentScript.bundle.js"]
    }
  ]
}
```

## Packing

After the development of your extension run the command

```
$ NODE_ENV=production npm run build
```

Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.

## Secrets

If you are developing an extension that talks with some API you probably are using different keys for testing and production. Is a good practice you not commit your secret keys and expose to anyone that have access to the repository.

To this task this boilerplate import the file `./secrets.<THE-NODE_ENV>.js` on your modules through the module named as `secrets`, so you can do things like this:

_./secrets.development.js_

```js
export default { key: '123' };
```

_./src/popup.js_

```js
import secrets from 'secrets';
ApiCall({ key: secrets.key });
```

:point_right: The files with name `secrets.*.js` already are ignored on the repository.

## Resources:

- [Webpack documentation](https://webpack.js.org/concepts/)
- [Chrome Extension documentation](https://developer.chrome.com/extensions/getstarted)

## License

(MIT License) - Copyright (c) 2021 Sunny Wong
