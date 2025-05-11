import { User } from "../types/types";

const checkIncomingObject = (incomingObj: unknown) => {
  const user = incomingObj as User;
  return !!(
    user.username &&
    typeof user.username === 'string' &&
    user.age &&
    typeof user.age === 'number' &&
    user.hobbies &&
    Array.isArray(user.hobbies)
  );
};

export default checkIncomingObject