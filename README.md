# volto-slate-footnote
[![Releases](https://img.shields.io/github/v/release/eea/volto-slate-footnote)](https://github.com/eea/volto-slate-footnote/releases)

[Volto](https://github.com/plone/volto) add-on

## Features

###

Demo GIF

## Getting started

1. Create new volto project if you don't already have one:
    ```
    $ npm install -g @plone/create-volto-app
    $ create-volto-app my-volto-project
    $ cd my-volto-project
    ```

1. Update `package.json`:
    ``` JSON
    "addons": [
        "volto-slate:asDefault",
        "@eeacms/volto-slate-footnote"
    ],

    "dependencies": {
        "@plone/volto": "8.2.0",
        "volto-slate": "github:eea/volto-slate#0.8.2",
        "@eeacms/volto-slate-footnote": "github:eea/volto-slate-footnote#0.4.0"
    }
    ```

1. Install new add-ons and restart Volto:
    ```
    $ yarn
    $ yarn start
    ```

1. Go to http://localhost:3000

1. Happy editing!

## How to contribute

See [DEVELOP.md](DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
