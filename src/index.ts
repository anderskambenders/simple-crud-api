import 'dotenv/config';
import { createServer, IncomingMessage, request, ServerResponse } from 'http';
import { handleRequest } from './controller/requestHandler';
import { UsersModel } from './model/usersModel';
import { EOL } from 'os';


export const port = process.env.PORT! || 5000;
const host = 'localhost';

export const server = createServer((request: IncomingMessage, response: ServerResponse) => {
    const { url, method } = request;
    try {
      const urlArray = (url as string).split('/').filter((item) => item);
      const handle = handleRequest(method, urlArray, url);
      const userId = urlArray[2];
    } catch (error) {
      response.end(`Internal Server Error`)
    }
})

  server.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}${EOL}`);
  })