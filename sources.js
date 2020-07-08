module.exports = (server) => {
  CDN_SERVERS = {
    "http://localhost:10": {
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
    "http://localhost:20": {
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
    "http://localhost:30": {
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
  };

  return CDN_SERVERS[server];
};
