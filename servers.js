const jsonServer = require("json-server");
const middlewares = jsonServer.defaults();

// Simulating servers
[10, 20, 30].map((port) => {
  const server = jsonServer.create();
  server.use(jsonServer.bodyParser);
  server.use(middlewares);

  server.get("/image", (request, response) => {
    const host = `http://localhost:${request.client.localPort}`;

    if (request.method === "GET") {
      const serverSources = require("./sources")(host);
      if (serverSources && serverSources.images) {
        response.status(200).jsonp(serverSources.images);
      } else {
        response.status(404).send("Not Found");
      }
    }
  });

  server.get("/stat", (req, res) => {
    setTimeout(
      () => res.status(200).send("OK"),
      () => Math.floor(10000 * Math.random())
    );
  });

  return server.listen(port, () => {
    console.log(`CDN Server is running on port: ${port}`);
  });
});
