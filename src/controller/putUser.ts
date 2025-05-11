import getRequestData from '../utils/getRequestData';
import checkIncomingObject from '../utils/checkIncomingObject';
import { User } from '../types/types';
import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import ErrorHttp from '../errors/errorHttp';
import { UsersModel } from '../model/usersModel';

const putUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string,
  userModel: UsersModel
): Promise<void> => {
  const correctUserId = userId as string;

  try {
    if (!uuidValidate(correctUserId)) throw new ErrorHttp(`UserId ${correctUserId} is invalid. Not uuid.`, 400);
    const user = userModel.getUser(correctUserId);
    if (user === null) throw new ErrorHttp(`User with id ${correctUserId} doesn't exist.`, 404);
    const userObject = await getRequestData(req);
    const isCorrectUser = checkIncomingObject(userObject);
    if (!isCorrectUser) {
      throw new ErrorHttp(`User object doesn't contain required fields or incorrect field`, 400);
    }
    const newUser = userModel.updateUser(correctUserId, userObject as User);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ErrorHttp('User object is invalid', 400);
    } else {
      throw error;
    }
  }
};

export default putUser;