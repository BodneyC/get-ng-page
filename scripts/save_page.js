const page = require('webpage').create()
const url = require('system').args[1]

function pageReady() {
  htmlContent = page.evaluate(function() {
    return document.documentElement.outerHTML
  })
  console.log(htmlContent)
  phantom.exit()
}

page.open(url, function() {
  function checkState() {
    setTimeout(function() {
      var state = page.evaluate(function() {
        return document.readyState
      })
      if(state === 'complete')
        pageReady()
      else
        checkState()
    })
  }
  checkState()
})
