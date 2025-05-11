import getUsers from "./getUsers";

const endpoints = {
  'GET': getUsers,
  'POST': PostUser,
  'PUT': PutUser,
  'DELETE': DeleteUser,
};

export const handleRequest = (method, urlArray, url) => {
  if (method && urlArray[0] === 'api' && urlArray[1] === 'users' && endpoints[method]) {
    return endpoints[method];
  }
  throw new Error('http error');
};