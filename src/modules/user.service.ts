import { User } from './user.model';
import { TUser } from './user.validation.schema';

async function createUserIntoDB(userData: TUser) {
  const user = await User.create(userData);
  return user;
}

async function getAllUserFromDB() {
  const users = await User.find(
    {},
    { username: 1, fullName: 1, age: 1, email: 1, address: 1 },
  );
  return users;
}

async function updateUserToDB(userId: number, userData: TUser) {
  const updateStatus = await User.updateOne({ userId }, userData, {
    new: true,
  });
  return updateStatus;
}

async function deleteUserFromDB(userId: number) {
  const deleteStatus = await User.deleteOne({ userId });
  return deleteStatus;
}

export const UserService = {
  createUserIntoDB,
  getAllUserFromDB,
  updateUserToDB,
  deleteUserFromDB,
};
