const http = require("http");
const exerciseCDN = require("./exercise-cdn");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer();
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  exerciseCDN.main();
});
