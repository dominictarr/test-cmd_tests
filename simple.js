
var cmd = require.resolve('test-cmd')
  , exec = require('child_process').exec
  , it = require ('it-is').style('colour')
  , fs = require('fs')

function test (file, callback) {
  console.log('testing test-cmd against:' + file)
  var tmp = '/tmp/exampleReport' + Math.random()

  exec([process.execPath, cmd, file, '--reportFile', tmp].join(' ')
    , {cwd: __dirname}
    , function (err, stdout, stderr) {
      console.log(stderr)
        var report = JSON.parse(fs.readFileSync(tmp))
        fs.unlinkSync(tmp)
        callback(err, report)
      })
}

test('fixtures/passing.js', function (err, report) {
  it(err).equal(null)
  it(report).has({
    status: 'success'
  })
})

test('fixtures/error.js', function (err, report) {
  it(err).has({code: 1 })
  it(report).has({
    status:'error'
  , failures: [{message: 'EXAMPLE ERROR'}]
  })
})

test('fixtures/failure.js', function (err, report) {
  it(report).has({
    status:'failure'
  , failures: [{name: 'AssertionError'}]
  })
})

test('fixtures/passing.js fixtures/failure.js fixtures/error.js', function (err, report) {
  it(err).has({code: 2 })
  it(report).has({
    status: 'error'
  , tests: [
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
    ]
  })
})

//*/
