# volto-slate-footnote
[![Releases](https://img.shields.io/github/v/release/eea/volto-slate-footnote)](https://github.com/eea/volto-slate-footnote/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-slate-footnote%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-slate-footnote/job/master/display/redirect)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-slate-footnote%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-slate-footnote/job/develop/display/redirect)

[Volto Slate](https://github.com/eea/volto-slate/tree/develop) Footnotes

## Features

### Easily annotate text within [Volto Slate](https://github.com/eea/volto-slate/tree/develop) text editor

![Insert footnotes](https://github.com/eea/volto-slate-footnote/raw/docs/docs/volto-slate-footnote.gif)

## Getting started

1. Create new volto project if you don't already have one:

   ```
   $ npm install -g yo @plone/generator-volto
   $ yo @plone/volto my-volto-project --addon volto-slate @eeacms/volto-slate-footnote

   $ cd my-volto-project
   $ yarn add -W volto-slate @eeacms/volto-slate-footnote
   ```

1. If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
      "volto-slate:asDefault",
      "@eeacms/volto-slate-footnote"
   ],

   "dependencies": {
      "volto-slate": "^1.0.0",
      "@eeacms/volto-slate-footnote": "^1.0.0"
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
