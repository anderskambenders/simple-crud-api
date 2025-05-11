import getUsers from "./getUsers";
import postUser from "./postUser";
import putUser from "./putUser";
import deleteUsers from "./deleteUser";
import ErrorHttp from "../errors/errorHttp";

interface EndpointHandlers {
  [key: string]: Function;
}

const endpoints: EndpointHandlers = {
  'GET': getUsers,
  'POST': postUser,
  'PUT': putUser,
  'DELETE': deleteUsers,
};

export const handleRequest = (method: string, urlArray: string[], url: string) => {
  if (method && urlArray[0] === 'api' && urlArray[1] === 'users' && endpoints[method]) {
    return endpoints[method];
  }
  throw new ErrorHttp(`Non-existing endpoint ${method} ${url}`, 404);
};