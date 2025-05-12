import { ServerResponse } from 'http';
import ErrorHttp from './errorHttp';

export const handleErrors = (err: ErrorHttp | Error, response: ServerResponse) => {
  if (err instanceof ErrorHttp) {
    response.writeHead(err.statusCode, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(err.message));
    return;
  }
  response.writeHead(500, { 'Content-Type': 'text/plain' });
  response.end(`Internal Server Error ${err.message}`);
};