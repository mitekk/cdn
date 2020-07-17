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

const CDN_ORG = {
  server: "http://localhost:40",
};

const axiosInst = axios.create({
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
  let availableCDNServers;

  const byResponseTime = (a, b) => {
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

      if (!!cdnServer.unreachable) {
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
          // handle failures seperatly for each stat request
          if (error.code === "ECONNABORTED" || error.code === "ENOTFOUND") {
            handleUnreachanble(error.config.baseURL);
          } else {
            console.error(error);
          }
        })
      )
    ).then((servers) => {
      return servers.filter((server) => server).sort(byResponseTime);
    });
  };

  try {
    availableCDNServers = await pingServers();
  } catch (error) {
    console.error(error);
  }

  return (imageToQuery) => {
    let imageRequest;

    if (availableCDNServers) {
      const {
        config: { baseURL },
      } = availableCDNServers.pop();
      imageRequest = axiosInst.get(`/images/${imageToQuery}`, { baseURL });
    } else {
      console.info(
        `no cdn server was found, switching to CDN_ORG: ${CDN_ORG.server}`
      );
      imageRequest = axiosInst.get(`/images/${imageToQuery}`, {
        baseURL: CDN_ORG.server,
      });
    }

    return imageRequest.catch((err) => {
      console.log(err);
    });
  };
}

module.exports = { select };
