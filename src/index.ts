import { createServer, IncomingMessage, request, ServerResponse } from 'http';
import { handleErrors } from './errors/errorsHandler';
import { handleRequest } from './controller/requestHandler';
import { UsersModel } from './model/usersModel';
import { cpus } from 'os';
import cluster from 'cluster';
import 'dotenv/config';
import { EOL } from 'os';
import 'dotenv/config';


export const userModel = new UsersModel();
const port = Number(process.env.PORT! || 5000);
const host = 'localhost';

export const server = createServer((request: IncomingMessage, response: ServerResponse) => {
  const { url, method } = request;
  try {
    const urlArray = (url as string).split('/').filter((item) => item);
    const handle = handleRequest(method as string, urlArray, url as string);
    const userId = urlArray[2];
    handle(userModel, response, request,  userId).catch((error: unknown) => handleErrors(error as Error, response));
    console.log(port)
  } catch (error) {
    handleErrors(error as Error, response);
  }
})

if (!process.argv.slice(2) || process.argv.slice(2)[0] !== '--multi') {
  server.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}${EOL}`);
  })
}
server.on('error', (error) => {
  console.log('Error http server', error);
});



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