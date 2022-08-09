const http = require("http");
const https = require("https");
const imports = require('./app.js')
const app = imports.app
const options = imports.options
//import {app, options} from './app.js';

//const app = require("./app");
//const options = require("./options");


https.createServer(options, app).listen(process.env.PORT || 8800, () => {
  console.log("Server running on https://localhost:8800 🎉 🚀");
});
