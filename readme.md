# [Übersicht](/felixhageloh/uebersicht) Widgets

![screenshot of my widgets](https://file-qfcxmtfpxd.now.sh)

## Features

* 🕐 **Clock:** smartly only repaints once per minute (to save battery 💪🔋).
* 📆 **Calendar:** highlights current day.
* 🌤️ **Weather:** uses the current location (needs Wifi) and the Dark Sky API to get a weather forecast. After 9 PM it shows the forecast for next day.
* 👨🏻‍💻 **Dirty Git Repos:** shows a list of all git repositories that have uncommitted file changes.
* 🛎 **Github Notifications:** shows a list of unseen Github notifications (and also notifies [AnyBar](/tonsky/AnyBar)).

_I use the font [Source Code Pro](/adobe-fonts/source-code-pro)._

## Installation

1. Clone this repository.
2. Add your API keys to `secrets.js` (get the keys here: [Github](https://github.com/settings/tokens), [Dark Sky](https://darksky.net/dev)).
3. Open the Übersicht preferences and change the widgets folder to the one called `widgets` in this repository.

_**optionally:**_

4. Install the font "Source Code Pro": `cask install caskroom/fonts/font-source-code-pro`.
5. Change your background to `#1e1e1e` to make the status bar look invisible.
