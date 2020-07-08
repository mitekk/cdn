const axios = require("axios").default;

const CDN_SERVERS = [
  {
    server: "http://localhost:10",
    unreachable: 0,
  },
  {
    server: "http://localhost:20",
    unreachable: 0,
  },
  {
    server: "http://localhost:30",
    unreachable: 0,
  },
];

var axiosInst = axios.create({
  timeout: 10,
});

axiosInst.interceptors.request.use(
  (req) => {
    req.meta = req.meta || {};
    req.meta.requestStartedAt = new Date().getTime();
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInst.interceptors.response.use(
  (res) => {
    res.responseTime = new Date().getTime() - res.config.meta.requestStartedAt;
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * @returns Promise<path => Promise<any>>
 */
async function select() {
  const byResTime = (a, b) => {
    if (a.responseTime < b.responseTime) {
      return -1;
    }
    if (a.responseTime > b.responseTime) {
      return 1;
    }
    return 0;
  };

  const handleUnreachanble = (server) => {
    const cdnServerIndex = CDN_SERVERS.findIndex(
      (cdn) => cdn.server === server
    );

    if (cdnServerIndex !== -1) {
      const cdnServer = CDN_SERVERS[cdnServerIndex];

      if (cdnServer.unreachable > 1) {
        CDN_SERVERS.splice(cdnServerIndex, 1);
        console.info(`${server} was removed due to inactivity`);
      } else {
        cdnServer.unreachable++;
        console.info(`${server} is unreachable`);
      }
    }
  };

  const pingServers = () => {
    return Promise.all(
      CDN_SERVERS.map((cdn) =>
        axiosInst.get("/stat", { baseURL: cdn.server }).catch((error) => {
          if (error.code === "ECONNABORTED") {
            handleUnreachanble(error.config.baseURL);
          }
        })
      )
    ).then((servers) => {
      return servers
        .filter((server) => server)
        .sort(byResTime)
        .pop();
    });
  };

  try {
    const fastestServer = await pingServers();
    console.info(`fastest Server found: ${fastestServer.config.baseURL}`);
  } catch (error) {
    console.error(error);
  }

  return;
}

module.exports = { select };
