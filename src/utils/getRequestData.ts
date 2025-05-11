
import { IncomingMessage } from "http";

const getRequestData = (request: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    request.on('end', () => {
      try {
        const userObject = JSON.parse(body);
        resolve(userObject as object);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default getRequestData;