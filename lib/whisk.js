const child_process = require('child_process');
const spawn = child_process.spawnSync;
const colors = require('colors');

// get the openwhisk namespace
const namespace = function() {
  // get the names space that wsk is publishing to
  var ns = spawn( 'wsk', ['namespace', 'list']);
  var str = ns.stdout.toString('utf8');
  var bits = str.split('\n');
  var retval = null;
  if (bits.length >= 2 && bits[0] === 'namespaces') {
    retval = bits[1];
  }
  return retval.trim();
};

// deploy an action
const createAction = function(name, path) {

  // create package
  var packageParams = ['package', 'update', 'autocomplete'];
  var packageCreate = spawn( 'wsk', packageParams);

  // create OpenWhisk action
  var createParams = ['action', 'update', 'autocomplete/'+name, '--kind', 'nodejs:6', path, '--web', 'true'];
  var actionCreate = spawn( 'wsk', createParams);

  // if there were errors
  if (actionCreate.status || packageCreate.status) {
    if (packageCreate.stderr) {
      console.error(packageCreate.stderr.toString('utf8').red);
      return false;
    }
    if (actionCreate.stderr) {
      console.error(actionCreate.stderr.toString('utf8').red);
      return false;
    }
  }
  return true;
};

const url = function(namespace, package, action) {
  return 'https://openwhisk.ng.bluemix.net/api/v1/web/' + namespace + '/' + package + '/' + action;
}


module.exports = {
  namespace: namespace,
  createAction: createAction,
  url: url
};