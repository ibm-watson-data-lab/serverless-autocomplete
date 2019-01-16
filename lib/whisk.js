const child_process = require('child_process');
const spawn = child_process.spawnSync;
const colors = require('colors');

// get the openwhisk namespace
const namespace = function() {
  // get the names space that wsk is publishing to
  var ns = spawn( 'ibmcloud', ['fn', 'namespace', 'list']);
  var str = ns.stdout.toString('utf8');
  console.log(str)
  var bits = str.split('\n');
  var retval = null;
  if (bits.length >= 2) {
    retval = bits[1].split(' ')[0];
  } else {
    throw new Error('Cannot determine your namespace - follow instructions https://console.bluemix.net/docs/openwhisk/bluemix_cli.html#cloudfunctions_cli')
  }
  console.log(retval)
  return retval.trim();
};

// deploy an action
const createAction = function(name, path) {

  // create package
  var packageParams = ['fn', 'package', 'update', 'autocomplete'];
  var packageCreate = spawn( 'ibmcloud', packageParams);

  if(packageCreate.status) {
    // package could not be created/updated; display error and abort processing
    console.error(packageCreate.stderr.toString('utf8').red);
    return false;
  }

  // create OpenWhisk action
  // I5: apply workaround for server-side issue
  var createParams = ['fn', 'action', 'update', 'autocomplete/'+name, '--kind', 'nodejs:6', path, '-a', 'web-export', 'true'];
  var actionCreate = spawn( 'ibmcloud', createParams);

  if(actionCreate.status) {
    // action could not be created/updated; display error and abort processing
    console.error(actionCreate.stderr.toString('utf8').red);
    return false;
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
