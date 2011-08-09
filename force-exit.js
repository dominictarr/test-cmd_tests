
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
        var report = JSON.parse(fs.readFileSync(tmp))
        fs.unlinkSync(tmp)
        callback(err, report)
      },5000))

    //child.stdout.on('data', console.log)
    child.stdout.on('data', function(){
      child.kill(signal)
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

