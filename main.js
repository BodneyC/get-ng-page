const jsb = require('js-beautify')
const fs = require('fs')
const phantom = require('phantom');
 
const getFilename = (url) => {
  url = url.replace(/\//g, '.')
  if(!/.html$/.test(url))
    url += '.html'
  return url
}

const beautifyPage = (htmlContent) => {
  const options = {
    'indent_size': 2,
    'indent_with_tabs': false,
    'eol': '\n'
  }
  return jsb.html(htmlContent, options)
}

const save_page = async (url, proxy) => {
  let content
  try {
    const instance = await phantom.create([ 
      `--proxy=${proxy}`
    ]);
    const page = await instance.createPage();
    await page.on('onResourceRequested', () => { });
   
    await page.open(url);
    content = await page.property('content');
   
    await instance.exit();
  } catch(e) {
    return e
  }
  return content
}

const processUrl = (url, gngpArgv) => {
  const filename = `${gngpArgv.outdir}/${getFilename(url)}`
  save_page(url, gngpArgv.proxy).then((res) => {
    if(res instanceof Error) {
      console.log(`Phantom failure: URL ${url}\n${res}`)
      return
    }
    fs.writeFile(filename, beautifyPage(res), (err) => {
      if(err) {
        console.log(`Write failure: URL ${url}\n${err}`)
        return
      }
      console.log(`Success: URL ${url}\n\tFile: ${filename}`)
    })
  })
}

const main = (gngpArgv) => {
  gngpArgv.proxy = gngpArgv.proxy || ''
  gngpArgv.outdir = gngpArgv.outdir || './output_dir'
  if(!fs.existsSync(gngpArgv.outdir))
    fs.mkdirSync(gngpArgv.outdir)
  var urls = []
  if(gngpArgv.url)
    urls = gngpArgv.url.split(/, */)
  if(gngpArgv.urllist)
    urls.concat(urls, fs.readFileSync(gngpArgv.urllist, 'utf-8').toString().split('\n'))
  for(var i = 0; i < urls.length; i++)
    processUrl(urls[i], gngpArgv)
}

const getNgPage = (gngpArgv) => {
  console.log(!gngpArgv)
  if(!gngpArgv || (!gngpArgv.url && !gngpArgv.urllist)) {
    console.log('Error, usage:\n\trequire(\'get-ng-page\')({' + 
      '\n\t  [\'proxy\':  \'<url:port>\'],' +
      '\n\t  [\'outdir\': \'./output_dir\'],' +
      '\n\t  \'url\':     \'<url[,...]>\',' +
      '\n\t  \'urllist\':   \'<url list file>\',' +
      '\n\t})')
    return
  }
  main(gngpArgv)
}

if(require.main === module) {
  const miniArgv = require('minimist')(process.argv.slice(2))
  const gngpArgv = {
    'outdir': miniArgv.outdir,
    'proxy': miniArgv.proxy,
    'url': miniArgv.url,
    'urllist': miniArgv.urllist
  }
  if(!gngpArgv.url && !gngpArgv.urllist) {
    console.log('Usage:\n\t$ yarn start [--outdir <output directory>] [--proxy <url:port>] --url <url[,...]> --urllist <file of urls>')
    process.exit()
  }
  main(gngpArgv)
} 

module.exports = getNgPage
