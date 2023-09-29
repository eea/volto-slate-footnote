# volto-slate-footnote

[![Releases](https://img.shields.io/github/v/release/eea/volto-slate-footnote)](https://github.com/eea/volto-slate-footnote/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-slate-footnote%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-slate-footnote/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-slate-footnote%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-slate-footnote/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-slate-footnote-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-slate-footnote-develop)


[Volto Slate](hhttps://6.dev-docs.plone.org/volto/configuration/volto-slate/) Footnotes

## Features

### Easily annotate text within [Volto Slate](https://6.dev-docs.plone.org/volto/configuration/volto-slate/) text editor

![Insert footnotes](https://github.com/eea/volto-slate-footnote/raw/docs/docs/volto-slate-footnote.gif)

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

* If not, create one:

   ```
   npm install -g yo @plone/generator-volto
   yo @plone/volto my-volto-project --canary --addon @eeacms/volto-slate-footnote
   cd my-volto-project
   ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

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
