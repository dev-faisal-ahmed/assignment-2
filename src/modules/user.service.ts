import { User } from './user.model';
import { TUser } from './user.validation.schema';

export async function createUserIntoDB(userData: TUser) {
  const student = await User.create(userData);
  return student;
}
