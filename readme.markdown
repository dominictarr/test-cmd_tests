#test command (tests)

testing test-cmd:
  
  * should generate the correct report. 
  * should return the correct error code.
  * should write the test report as json to --reportFile <file>
  
this will form the basis for testing the test adapters.

test any test command given a set of fixture tests which pass, fail, and error.