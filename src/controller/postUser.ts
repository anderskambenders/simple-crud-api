import getRequestData from '../utils/getRequestData';
import checkIncomingObject from '../utils/checkIncomingObject';
import { IncomingMessage, ServerResponse } from 'http';
import { UsersModel } from '../model/usersModel';;
import ErrorHttp from '../errors/errorHttp';
import { User } from '../types/types';
import { showRequestStatus } from '../utils/showRequestStatus';

const postUsers = async (
  usersModel: UsersModel,
  res: ServerResponse,
  req: IncomingMessage,
  userId?: string | undefined,
): Promise<void> => {
  try {
    const userObject = await getRequestData(req);
    const isCorrectUser = checkIncomingObject(userObject);
    if (!isCorrectUser) {
      showRequestStatus(req, 400);
      throw new ErrorHttp(`User object does not contain required fields`, 400);
    }
    const user = usersModel.addUser(userObject as User);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
    showRequestStatus(req, 201);
  } catch (error) {
    if (error instanceof SyntaxError) {
      showRequestStatus(req, 400);
      throw new ErrorHttp(`User object is invalid, ${error.message}`, 400);
    } else {
      showRequestStatus(req, 400);
      throw error;
    }
  }
};

export default postUsers;