
var cmd = require.resolve('test-cmd')
  , exec = require('child_process').exec
  , spawn = require('child_process').spawn
  , it = require ('it-is').style('colour')
  , fs = require('fs')
  , helper = require('test-helper')

//pipes, but without sending close!

function safePipe (i,o, prefix) {
  i.on('data', function (d) {
    o.write(prefix + d)
  })
}

function test (file, signal, callback) {
  console.log('testing test-cmd against:' + file)
  var tmp = '/tmp/exampleReport' + Math.random()

  var child = spawn(process.execPath
                  , [cmd, file, '--reportFile', tmp]
                  , {cwd: __dirname})

  //using regular pipe is annoying because it will propogate the 'close' event

  safePipe(child.stdout, process.stdout, child.pid + '_out: ')
  safePipe(child.stderr, process.stdout, child.pid + '_err: ')

  child.on('exit'
    , helper.checkCall(function (err, signal) {
        //setTimeout(function() {
        var report = JSON.parse(fs.readFileSync(tmp))
        fs.unlinkSync(tmp)
        callback(err, report)
        //}, 1000)
      }, 5000))

    //child.stdout.on('data', console.log)
    child.stdout.on('data', function(){
      // was getting a race condition with this test.
      // I added console.log to test runner
      // which was killing the child process before 
      // it had setup the the exit handler
      // so tests where failing with cryptic error
      // & removing some logging statements fixed it.
      setTimeout(function () {child.kill(signal)},200)
//      child.kill(signal)
    })

  return child

}

test('fixtures/hang.js', 'SIGTSTP', function (err, report) {
  it(err).ok()
  it(report).has({
    status: 'error'
  })
  console.log('fixtures/hang.js exited correctly with SIGINT')
})

test('fixtures/hang.js', 'SIGINT', function (err, report) {
  it(err).ok()
  it(report).has({
    status: 'error'
  })
  process.stdout.write('fixtures/hang.js exited correctly with SIGINT\n')
})

