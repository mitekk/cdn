/**
 * You have to implement "cdn" module with one exported function "select"
 * select - choose fastest server and return function to fetch from the selected server
 *
 * Assumptions:
 * 1. environment contain list of CDN servers in the following format:
 *    CDN_SERVERS = "server1,domain2,server3"
 * 2. environment contain the org server:
 *    CDN_ORG = "org-server.com"
 * 3. Not all content exists on all servers
 * 4. Not all servers are accessible
 * 5. Each server contain "/stat" end-point return HTTP 200 if server up and working properly
 *
 * Requirements:
 * 1. if server is not accessible more than once, remove it from cdn servers list
 * 2. if content not exists on cdn server, you have to choose the next fastest one
 * 3. if content not exists on all cdn servers, fetch data from org server
 *
 * Advanced/Bonus:
 * The serve function will log message to console: "fetch /a/b/c from server: example"
 * The implementation should be written at the bonus section and not in the module.
 */
const { select } = require("./cdn");

async function main() {
  const serve = await select();

  // bonus section
  // serve = ....

  //   await serve("/api/fetch-items");
}

module.exports = { main };
