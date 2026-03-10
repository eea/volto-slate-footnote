# volto-slate-footnote

[![Releases](https://img.shields.io/github/v/release/eea/volto-slate-footnote)](https://github.com/eea/volto-slate-footnote/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-slate-footnote%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-slate-footnote/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-slate-footnote%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-slate-footnote/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote&branch=develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote&branch=develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote&branch=develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote&branch=develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote&branch=develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote&branch=develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote&branch=develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote&branch=develop)


[Volto Slate](hhttps://6.dev-docs.plone.org/volto/configuration/volto-slate/) Footnotes

## Features

### Easily annotate text within [Volto Slate](https://6.dev-docs.plone.org/volto/configuration/volto-slate/) text editor

![Insert footnotes](https://raw.githubusercontent.com/eea/volto-slate-footnote/master/docs/volto-slate-footnote.gif)

## Upgrade

### Upgrading to 6.x

This version requires: `@plone/volto >= 16.0.0.alpha.15` (`volto-slate` part of Volto Core).

## Getting started

### Try volto-slate-footnote with Docker

      git clone https://github.com/eea/volto-slate-footnote.git
      cd volto-slate-footnote
      make
      make start

Go to http://localhost:3000

`make start` now defaults to Volto 18. To run the same setup against Volto 17, use:

      VOLTO_VERSION=17 make
      VOLTO_VERSION=17 make start

### Add volto-slate-footnote to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-slate-footnote"
   ],

   "dependencies": {
       "@eeacms/volto-slate-footnote": "*"
   }
   ```

* If not, create one with Cookieplone, as recommended by the official Plone documentation for Volto 18+:

   ```
   uvx cookieplone project
   cd project-title
   ```

1. Install or update dependencies, then start the project:

   ```
   make install
   ```

   For a Cookieplone project, start the backend and frontend in separate terminals:

   ```
   make backend-start
   make frontend-start
   ```

   For a legacy Volto 17 project, install the package with `yarn` and restart the frontend as usual.

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-slate-footnote/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-slate-footnote/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-slate-footnote/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
