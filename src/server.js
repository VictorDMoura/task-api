import http from "node:http";

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method == "GET" && url == "/tasks") {
    res.writeHead(200).end(JSON.stringify(tasks));
  }
  return res.writeHead(404).end();
});

server.listen(3333);
