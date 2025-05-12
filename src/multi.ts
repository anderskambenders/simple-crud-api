import { cpus } from 'os';
import cluster from 'cluster';
import { createServer, IncomingMessage, request, ServerResponse } from 'http';
import 'dotenv/config';
import { server } from '.';

const port = Number(process.env.PORT! || 5000);
const coresCount = cpus().length;
let currPort = port + 1;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running, port ${port}`);
  createServer((req: IncomingMessage, res: ServerResponse) => {
    let options = {
      hostname: 'localhost',
      port: currPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };
    let proxy = request(options, function (resp: IncomingMessage) {
      res.writeHead(resp.statusCode!, resp.headers);
      resp.pipe(res, { end: true });
      if (currPort === port + coresCount) {
        currPort = port + 1;
      } else {
        currPort = currPort + 1;
      }
    });
    req.pipe(proxy, { end: true });
  }).listen(port);

  for (let i = 0; i < coresCount; i++) {
    cluster.fork({ PORT: port + 1 + i });
  }

  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  server.listen(process.env.PORT, () => {
    console.log(`Worker ${process.pid} started, port ${process.env.PORT}`);
  });
}