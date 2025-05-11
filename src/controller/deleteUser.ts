import { ServerResponse } from 'http';
import { UsersModel } from '../model/usersModel';
import { validate } from 'uuid';
import ErrorHttp from '../errors/errorHttp';


const deleteUsers = async (
  userModel: UsersModel,
  res: ServerResponse,
  userId: string,

): Promise<void> => {
  if (!validate(userId)) throw new ErrorHttp(`UserId ${userId} is invalid. Not uuid.`, 400);
  const user = userModel.getUser(userId);
  if (user === null) throw new ErrorHttp(`User with id ${userId} doesn't exist.`, 404);
  userModel.deleteUser(userId);
  res.statusCode = 204;
  res.end();
};

export default deleteUsers;