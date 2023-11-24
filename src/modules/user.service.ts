import { User } from './user.model';
import { TOrder, TUser } from './user.validation.schema';

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

async function addOrderToDB(userId: number, orderData: TOrder) {
  const userData = await User.findOne({ userId }, { orders: 1 });
  if (!userData.orders) {
    const orders: TOrder[] = [];
    orders.push(orderData);
    const addOrderStatus = await User.updateOne({ userId }, { orders: orders });
    return addOrderStatus;
  }

  const addOrderStatus = await User.updateOne(
    { userId },
    { $push: { orders: orderData } },
  );
  return addOrderStatus;
}

export const UserService = {
  createUserIntoDB,
  getAllUserFromDB,
  updateUserToDB,
  deleteUserFromDB,
  addOrderToDB,
};
