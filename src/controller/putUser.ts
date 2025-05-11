import getRequestData from '../utils/getRequestData';
import checkIncomingObject from '../utils/checkIncomingObject';
import { User } from '../types/types';
import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import ErrorHttp from '../errors/errorHttp';
import { UsersModel } from '../model/usersModel';
import { showRequestStatus } from '../utils/showRequestStatus';

const putUsers = async (
  usersModel: UsersModel,
  res: ServerResponse,
  req: IncomingMessage,
  userId?: string | undefined,
): Promise<void> => {
  const correctUserId = userId as string;

  try {
    if (!uuidValidate(correctUserId)) throw new ErrorHttp(`UserId ${correctUserId} is invalid. Not uuid.`, 400);
    const user = usersModel.getUser(correctUserId);
    if (user === null) {
      showRequestStatus(req, 404);
      throw new ErrorHttp(`User with id ${correctUserId} doesn't exist.`, 404);
    }
    const userObject = await getRequestData(req);
    const isCorrectUser = checkIncomingObject(userObject);
    if (!isCorrectUser) {
      showRequestStatus(req, 400);
      throw new ErrorHttp(`User object doesn't contain required fields or incorrect field`, 400);
    }
    const newUser = usersModel.updateUser(correctUserId, userObject as User);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
    showRequestStatus(req, 200);
  } catch (error) {
    if (error instanceof SyntaxError) {
      showRequestStatus(req, 400);
      throw new ErrorHttp('User object is invalid', 400);
    } else {
      showRequestStatus(req, 400);
      throw error;
    }
  }
};

export default putUsers