Angular URLs
============

Finding that I could `wget` [Angular](https://angular.io/) webpages, being that they are mostly JS rendered, I looked to [PhantomJS2](https://www.npmjs.com/package/phantomjs2) for a solution.

## Downloading

```
git clone https://github.com/bodneyc/get-ng-urls.git
cd get-ng-urls
yarn install
```

## Usage

`$ yarn start [--outdir <output directory>] [--proxy <url:port>] --url <url> --urllist <file of urls>'`

E.g.: `$ yarn start --url <url> --urllist <file of urls>'`
