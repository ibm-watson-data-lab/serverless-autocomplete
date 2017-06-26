// load the autocomplete data
const arr = require('./data.json');
const MAX_RESULTS = 20;

// find the in index in 'array' where the value 'v' is stored
const binarySearch = function (array, v) {
  let lo = -1, hi = array.length;
  const vlen = v.length;
  let mi = -1;
  var miv = null;
  var finished = false;

  // binary search the array looking for prefix that matches v
  while (1 + lo !== hi) {
    // get centre point of the range
    mi = lo + ((hi - lo) >> 1);
    miv = array[mi].substr(0, vlen);
    if (miv == v) {
      break; 
    } else if (miv > v) {
      hi = mi;
    } else {
      lo = mi;
    }
  }

  // if we find one
  if (mi > 0) {

    // head backwards from this point to find the first match
    do {
      if (array[mi-1] < miv) {
        finished = true;
      } else {
        mi--
      }
    } while (mi > 0 && !finished);
  }
  return mi;
}

// main openwhisk entry
// opts.term = the term to autocomplete e.g. 'Mi';
// Uses 'arr' an array of strings in this form:
//   [ "middlesbrough*Middlesbrough",
//       "milton keynes*Milton Keynes" ]
const main = function(opts) {

  // do binary search to find first element in the array that matches our search term
  opts.term = opts.term.toLowerCase();
  const ind = binarySearch(arr, opts.term);

  // return value
  var retval = [];

  // if we had a match
  if (ind > -1) {

    // iterate through the array pulling out all the matches
    for (var i = ind; i < arr.length; i++) { 

      // if we are still finding matching strings
      if (arr[i].indexOf(opts.term) != 0) {
        break;
      }
      
      // extract the unmodifed string
      var j = arr[i].indexOf('*');

      // and add it to the return value
      retval.push(arr[i].substr(j+1));

      // don't let it exceed the max length
      if (retval.length === MAX_RESULTS) {
        break;
      }
    }
  }

  // return web-enabled data
  return {
    // CORS enabled - allow access from any web page
    headers: { 
      'Access-Control-Allow-Origin':'*',
      'Content-Type':'application/json'
    }, 
    statusCode:200,
    body: new Buffer(JSON.stringify(retval)).toString('base64')
  };
};

exports.main = main;


