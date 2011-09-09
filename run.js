
var cmd = require('test-cmd/runner')
  , adapter = require.resolve('test-cmd')
  , it = require ('it-is').style('colour')
  , helper = require('test-helper')
  , d = require('d-utils')
  , path = require('path')

function test (file, signal, callback) {
  console.log('testing test-cmd against:' + file)

  var child = cmd.runCP(adapter, path.join(__dirname, file), {}, helper.checkCall(callback, 5000))

  child.stdout.on('data', function(){
    d.delay(child.kill.bind(child),1e3)(signal)
  })

  return child
}

test('fixtures/hang.js', 'SIGTSTP', function (err, report) {
  if(err) throw err
  it(report).has({
    status: 'error'
  })
  console.log('fixtures/hang.js exited correctly with SIGINT')
})

//*/
test('fixtures/hang.js', 'SIGINT', function (err, report) {

  if(err) throw err
  it(report).has({
    status: 'error'
  })
  process.stdout.write('fixtures/hang.js exited correctly with SIGINT\n')
})
//*/
