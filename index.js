/*
USAGE:
node index.js

OPTIONS:
GET /health
GET /pi
GET /pi?iterations=n

EXAMPLE:
node index.js
PORT=3001 node index.js

WITH PM2: (npm install -g pm2)
pm2 start index.js --name "stress-test2"

SCALE PM2:
pm2 scale stress-test2 10
*/

const http = require("http");

const PORT = process.env.PORT || 8080;

function computePi(iterations) {
  // Formule de Leibniz : π/4 = 1 - 1/3 + 1/5 - 1/7 + ...
  let pi = 0;
  for (let i = 0; i < iterations; i++) {
    pi += (i % 2 === 0 ? 1 : -1) / (2 * i + 1);
  }
  return pi * 4;
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "healthy", pid: process.pid, uptime: process.uptime() }));
    return;
  }

  if (req.method === "GET" && req.url.split("?")[0] === "/pi") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const iterations = Math.min(parseInt(url.searchParams.get("iterations") || "10000000", 10), 500000000);

    const start = Date.now();
    const pi = computePi(iterations);
    const elapsedMs = Date.now() - start;

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "done",
      pi: pi,
      iterations: iterations,
      duration: `${elapsedMs}ms`,
      pid: process.pid,
    }));
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
