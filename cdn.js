const ping = require("ping");

const CDN_SERVERS = [
  {
    url: "google.com",
    unreachable: 0,
  },
  {
    url: "ynet.co.il",
    unreachable: 0,
  },
  {
    url: "bbc.com",
    unreachable: 0,
  },
  {
    url: "scmp.com",
    unreachable: 0,
  },
  {
    url: "fakeNews.com",
    unreachable: 0,
  },
  {
    url: "reallyfakenews.com/",
    unreachable: 0,
  },
];

/**
 * @returns Promise<path => Promise<any>>
 */
async function select() {
  const byResTime = (a, b) => {
    if (a.time < b.time) {
      return -1;
    }
    if (a.time > b.time) {
      return 1;
    }
    return 0;
  };

  const handleDead = (servers) => {
    return servers.reduce((aliveServers, server) => {
      if (server.alive) {
        aliveServers.push(server);
      } else {
        const cdnServerIndex = CDN_SERVERS.findIndex((cdnServer) => {
          cdnServer.url === server.host;
        });

        CDN_SERVERS[cdnServerIndex].unreachable > 1
          ? CDN_SERVERS.splice(cdnServerIndex, 1)
          : cdnServer.unreachable++;
      }
      return aliveServers;
    }, []);
  };

  Promise.all(
    CDN_SERVERS.map((server) =>
      ping.promise.probe(server.url, {
        timeout: 10,
      })
    )
  ).then((servers) => {
    servers = handleDead(servers);
    servers = servers.sort(byResTime);
    console.log(servers);
  });

  return;
}

module.exports = { select };
