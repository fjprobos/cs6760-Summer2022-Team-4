const http = require("http");
const imports = require('./app.js')
const app = imports.app



http.createServer(app).listen(process.env.PORT_UNSECURED || 8801, () => {
  console.log("Server running on http://localhost:8801 🎉 🚀");
});
