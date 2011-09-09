
var cmd = require('test-cmd/runner')
  , adapter = require.resolve('test-cmd')
  , it = require ('it-is').style('colour')
  , helper = require('test-helper')
  , d = require('d-utils')

cmd.exec([adapter
  , 'fixtures/passing.js'
  , 'fixtures/failure.js'
  , 'fixtures/error.js'
  ,  '--isolate'], {cwd: __dirname, timeout: 10e3}, function (err, report) {
  if(err) throw err
  console.log(report)
  it(report).has({
    tests: it.property('length', 3)
  , status: 'error'
  , failureCount: 2
  //need an unsorted comparison to test this right
/*  , tests: [
      { 
        name: 'fixtures/passing.js'
      , status: 'success' 
      }, 
      {
        name: 'fixtures/failure.js'
      , status:'failure'
      , failures: [{name: 'AssertionError'}]
      },
      {
        name: 'fixtures/error.js'
      , status:'error'
      , failures: [{message: 'EXAMPLE ERROR'}] 
      }
    ]*/
  })
})