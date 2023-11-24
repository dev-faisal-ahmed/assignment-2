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

  // checking if orders exist or not
  if (!userData.orders) {
    const orders: TOrder[] = [];
    orders.push(orderData); // pushing the order to the orders array
    const addOrderStatus = await User.updateOne({ userId }, { orders: orders });
    return addOrderStatus;
  }

  const addOrderStatus = await User.updateOne(
    { userId },
    { $push: { orders: orderData } }, // pushing order to the orders array
  );
  return addOrderStatus;
}

async function getAllOrdersFromDB(userId: number) {
  const ordersData = await User.findOne({ userId }, { orders: 1, _id: 0 });
  return ordersData;
}

async function getTotalPriceFromDB(userId: number) {
  const totalPrice = await User.aggregate([
    { $match: { userId } }, // finding users order
    { $unwind: { path: '$orders' } }, // making document for each orders
    {
      $project: {
        price: { $multiply: ['$orders.price', '$orders.quantity'] }, // finding the price * quantity
      },
    },
    { $group: { _id: userId, totalPrice: { $sum: '$price' } } }, // finding total price
    { $project: { _id: 0 } }, // hiding _id
  ]);
  return totalPrice[0] || { totalPrice: 0 }; // aggregate returns an array so and total price can be find at 0th index
}

export const UserService = {
  createUserIntoDB,
  getAllUserFromDB,
  updateUserToDB,
  deleteUserFromDB,
  addOrderToDB,
  getAllOrdersFromDB,
  getTotalPriceFromDB,
};
