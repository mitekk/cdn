const jsonServer = require("json-server");
const middlewares = jsonServer.defaults();

const cdnServers = [
  {
    host: "http://localhost",
    port: 10,
    images: [
      {
        title: "mouse",
        url: "https://www.pinterest.com/pin/325174035597926017/",
      },
      {
        title: "elefant",
        url: "https://www.pinterest.com/pin/711850284833453813/",
      },
    ],
  },
  {
    host: "http://localhost",
    port: 20,
    images: [
      {
        title: "captainA",
        url: "https://www.pinterest.com/pin/742531057295067718/",
      },
      {
        title: "zohan",
        url: "https://www.pinterest.com/pin/553590979196835388/",
      },
    ],
  },
  {
    host: "http://localhost",
    port: 30,
    images: [
      {
        title: "apple",
        url: "https://www.pinterest.com/pin/18084835982186324/",
      },
      {
        title: "orange",
        url: "https://www.pinterest.com/pin/304555993548826906/",
      },
    ],
  },
];

const cdnOrganization = {
  host: "http://localhost",
  port: 40,
  images: cdnServers.reduce((col, server) => [...col, ...server.images], []),
};

[...cdnServers, cdnOrganization].map((cdnServer) => {
  const server = jsonServer.create();

  server.use(jsonServer.bodyParser);
  server.use(middlewares);

  server.get("/images/:queryText", (request, response) => {
    const queryText = request.params["queryText"];

    if (!!queryText) {
      if (request.method === "GET") {
        const serverImages =
          cdnServer.images &&
          cdnServer.images.filter((image) => image.title.includes(queryText));

        if (serverImages && serverImages.length) {
          response
            .status(200)
            .jsonp(
              serverImages.filter((image) => image.title.includes(queryText))
            );
        } else {
          response.status(404).send(`No match found for '${queryText}'`);
        }
      }
    } else {
      response.status(400).send("'queryText' parameter is required");
    }
  });

  server.get("/stat", (req, res) =>
    setTimeout(
      () => res.status(200).send("OK"),
      () => Math.floor(10000 * Math.random())
    )
  );

  return server.listen(cdnServer.port, () =>
    console.log(`CDN Server is running on port: ${cdnServer.port}`)
  );
});
