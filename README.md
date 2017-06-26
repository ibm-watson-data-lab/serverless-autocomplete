# serverless-autocomplete

This npm package is a utility to help create autocomplete microservices from text files. It creates the microservice with your data embedded and returns you the URL of the service which can use in your web forms. 

It requires Node.js to run the `acsetup` utility and an [IBM OpenWhisk account](https://console.bluemix.net/openwhisk/?env_id=ibm:yp:us-south) to create the serverless microservices.

## Installation

This a Node.js utility so ensure you have [Node.js and npm installed](https://nodejs.org/en/download/). Then run:

```
npm install -g serverless-autocomplete
```

Ensure you have [downloaded the OpenWhisk command-line utility](https://console.bluemix.net/openwhisk/learn/cli?env_id=ibm:yp:us-south) `wsk` and authenticated it with your Bluemix credentials.

## Creating autocomplete services

You can now create as many autocomplete microservices as you need. Take text file containing the strings you wish to be used. The files should contain one string per line e.g.

```
George Washington
John Adams
Thomas Jefferson
James Madison
James Monroe
```

To create an autocomplete index, simple run `acsetup` with the path to the text file of strings:

```sh
> acsetup uspresidents.txt
```

It will return you:

- the URL of your autocomplete service
- an example `curl` statement
- an HTML snippet that shows your service embedded into a web page

If you don't have data to hand then [we've got you covered](https://github.com/ibm-cds-labs/serverless-autocomplete/tree/master/data).

```sh
acsetup countries.txt
acsetup names.txt
acsetup uktowns.txt
```

## Working with the API

Your service URL will look something like this:

    https://openwhisk.ng.bluemix.net/api/v1/web/USER/autocomplete/INDEX

where `USER` is your Bluemix username + space  e.g. `sue@gmail.com_dev` and `INDEX` is the name of your index e.g. `uspresidents`.

It requires a `term` parameter containing the string to be completed:

    https://openwhisk.ng.bluemix.net/api/v1/web/USER/autocomplete/INDEX?term=Ge

It outputs a JSON array e.g.

```js
["George H. W. Bush","George W. Bush","George Washington","Gerald Ford"]
```

If no matches are found, you get an empty array:

```js
[]
```

The API is compatible with the [jQuery Autocomplete API](http://api.jqueryui.com/autocomplete/).






