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


[Volto Slate](https://github.com/eea/volto-slate/tree/develop) Footnotes

## Features

### Easily annotate text within [Volto Slate](https://github.com/eea/volto-slate/tree/develop) text editor

![Insert footnotes](https://github.com/eea/volto-slate-footnote/raw/docs/docs/volto-slate-footnote.gif)

## Getting started

### Try volto-slate-footnote with Docker

1. Get the latest Docker images

   ```
   docker pull plone
   docker pull plone/volto
   ```

1. Start Plone backend
   ```
   docker run -d --name plone -p 8080:8080 -e SITE=Plone -e PROFILES="profile-plone.restapi:blocks" plone
   ```

1. Start Volto frontend

   ```
   docker run -it --rm -p 3000:3000 --link plone -e ADDONS="@eeacms/volto-slate-footnote" plone/volto
   ```

1. Go to http://localhost:3000

1. Login with **admin:admin**

1. Create a new **Page** and add a new **Footnotes** block.

1. Add a new **Text** block, type some text, select it and add your **footnote** annotation.

### Add volto-slate-footnote to your Volto project

1. If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
      "@eeacms/volto-slate-footnote"
   ],

   "dependencies": {
      "@eeacms/volto-slate-footnote": "^2.0.0"
   }
   ```

1. If not, create one:

   ```
   npm install -g yo @plone/generator-volto
   yo @plone/volto my-volto-project --addon @eeacms/volto-slate-footnote
   cd my-volto-project
   ```


1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
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
