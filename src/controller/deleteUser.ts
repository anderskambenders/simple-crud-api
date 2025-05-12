import { IncomingMessage, ServerResponse } from 'http';
import { UsersModel } from '../model/usersModel';
import { validate } from 'uuid';
import ErrorHttp from '../errors/errorHttp';
import { showRequestStatus } from '../utils/showRequestStatus';


const deleteUsers = async (
  usersModel: UsersModel,
  res: ServerResponse,
  req: IncomingMessage,
  userId: string,
): Promise<void> => {
  if (!validate(userId)) {
    showRequestStatus(req, 400)
    throw new ErrorHttp(`UserId ${userId} is invalid. Not uuid.`, 400);
  }
  const user = usersModel.getUser(userId);
  if (user === null) {
    showRequestStatus(req, 404)
    throw new ErrorHttp(`User with id ${userId} doesn't exist.`, 404);
  }
  usersModel.deleteUser(userId);
  res.statusCode = 204;
  showRequestStatus(req, 204)
  res.end();
};

export default deleteUsers;