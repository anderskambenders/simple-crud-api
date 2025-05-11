import { createServer, IncomingMessage, ServerResponse } from 'http';
import { handleErrors } from './errors/errorsHandler';
import { handleRequest } from './controller/requestHandler';
import { UsersModel } from './model/usersModel';
import 'dotenv/config';

export const userModel = new UsersModel();

export const server = createServer((request: IncomingMessage, response: ServerResponse) => {
  const { url, method } = request;
  try {
    const urlArray = (url as string).split('/').filter((item) => item);
    const handle = handleRequest(method as string, urlArray, url as string);
    const userId = urlArray[2];
    handle(userModel, response, request,  userId).catch((error: unknown) => handleErrors(error as Error, response));
  } catch (error) {
    handleErrors(error as Error, response);
  }
})
server.on('error', (error) => {
  console.log('Error http server', error);
});