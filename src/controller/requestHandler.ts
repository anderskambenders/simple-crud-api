import getUsers from "./getUsers";
import postUser from "./postUser";

const endpoints = {
  'GET': getUsers,
  'POST': postUser,
  'PUT': PutUser,
  'DELETE': DeleteUser,
};

export const handleRequest = (method, urlArray, url) => {
  if (method && urlArray[0] === 'api' && urlArray[1] === 'users' && endpoints[method]) {
    return endpoints[method];
  }
  throw new Error('http error');
};