import getRequestData from '../utils/getRequestData';
import checkIncomingObject from '../utils/checkIncomingObject';
import { IncomingMessage, ServerResponse } from 'http';
import { UsersModel } from '../model/usersModel';;
import ErrorHttp from '../errors/errorHttp';
import { User } from '../types/types';

const postUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  usersModel: UsersModel
): Promise<void> => {
  try {
    const userObject = await getRequestData(req);
    const isCorrectUser = checkIncomingObject(userObject);
    if (!isCorrectUser) {
      throw new ErrorHttp(`User object does not contain required fields`, 400);
    }
    const user = usersModel.addUser(userObject as User);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ErrorHttp('User object is invalid', 400);
    } else {
      throw error;
    }
  }
};

export default postUser;