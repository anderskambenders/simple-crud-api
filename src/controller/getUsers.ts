import { ServerResponse, IncomingMessage } from 'http';
import { validate } from 'uuid';
import ErrorHttp from '../errors/errorHttp';
import { UsersModel } from '../model/usersModel';
import { showRequestStatus } from '../utils/showRequestStatus';

const getUsers = async (
  usersModel: UsersModel,
  res: ServerResponse,
  req: IncomingMessage,
  userId?: string | undefined,
) => {
  if (!userId) {
    const users = usersModel.getAllUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
    showRequestStatus(req, 200)
    return;
  }
  if (!validate(userId)) {
    showRequestStatus(req, 400)
    throw new ErrorHttp(`UserId ${userId} is invalid.`, 400);
  }
  const user = usersModel.getUser(userId);
  if (user === null) {
    showRequestStatus(req, 404)
    throw new ErrorHttp(`User with id ${userId} doesn't exist.`, 404);
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  console.log(user)
  res.end(JSON.stringify(user));
  showRequestStatus(req, 200)
};

export default getUsers;