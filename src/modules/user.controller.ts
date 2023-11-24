import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/helpers';
import {
  OrdersValidationSubSchema,
  TUser,
  UserValidationSchema,
} from './user.validation.schema';
import { User } from './user.model';
import { UserService } from './user.service';
import { bcryptSalt } from '../config/config';
import bcrypt from 'bcrypt';

async function createUser(req: Request, res: Response) {
  try {
    const userData = req.body;
    // validating the data
    const { success } = UserValidationSchema.safeParse(userData);

    if (!success)
      return res.status(400).json(errorResponse('Data is not in right shape'));

    const userResponseData = await UserService.createUserIntoDB(userData);

    // removing the password filed form response
    const user = userResponseData.toObject();
    delete user.password;
    res.status(200).json(successResponse('User created successfully!', user));
  } catch (err) {
    console.log(err);
    res.status(400).json(errorResponse('User can not be created', 400));
  }
}

async function getAllUser(req: Request, res: Response) {
  try {
    const users = await UserService.getAllUserFromDB();
    res.status(200).json(successResponse('Users fetched successfully!', users));
  } catch (err) {
    console.log(err);
    res.status(400).json(errorResponse());
  }
}

async function getSpecificUser(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const user = await User.userExist(parseInt(userId));

    if (!user)
      return res.status(404).json(errorResponse('User not found', 404));
    res.status(200).json(successResponse('User fetched successfully!', user));
  } catch (err) {
    console.log(err);
    res.status(400).json(errorResponse());
  }
}

async function updateUser(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const userInfo: TUser = req.body;

    // validating the data
    // userInfo = UserValidationSchema.parse(userInfo);
    const { success } = UserValidationSchema.safeParse(userInfo);

    if (!success)
      return res
        .status(400)
        .json(errorResponse('User data is not in right shape'));

    // checking if user exist
    if (!(await User.userExist(parseInt(userId))))
      return res.status(404).json(errorResponse('User not found', 404));

    // updating the password
    userInfo.password = await bcrypt.hash(
      userInfo.password,
      parseInt(bcryptSalt),
    );

    // removing the userId , bcz we don't want it to be changed
    delete userInfo.userId;

    const updateStatus = await UserService.updateUserToDB(
      parseInt(userId),
      userInfo,
    );

    if (updateStatus.modifiedCount < 1)
      return res.status(400).json(errorResponse('Could not update user', 400));

    // getting users all data from the db
    const updatedData = await User.userExist(parseInt(userId));

    res
      .status(200)
      .json(successResponse('User updated successfully!', updatedData));
  } catch (err) {
    console.log(err);
    res.status(400).json(errorResponse());
  }
}

async function deleteUser(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    // checking if user exist
    if (!(await User.userExist(parseInt(userId))))
      return res.status(404).json(errorResponse('User not found!', 404));

    const deleteStatus = await UserService.deleteUserFromDB(parseInt(userId));
    if (deleteStatus.deletedCount < 1)
      return res.status(400).json(errorResponse('Failed to delete user', 400));

    res.status(200).json(successResponse('User deleted successfully!', null));
  } catch (err) {
    console.log(err);
    res.status(400).json(errorResponse());
  }
}

async function addOrder(req: Request, res: Response) {
  try {
    const orderDetail = req.body;
    const userId = req.params.userId;

    // validating data
    const { success } = OrdersValidationSubSchema.safeParse(orderDetail);
    if (!success)
      return res
        .status(400)
        .json(errorResponse('Order data is not in right shape'));

    // checking if user exist
    if (!(await User.userExist(parseInt(userId))))
      return res.status(404).json(errorResponse('User not found!', 404));

    // creating new orders
    const addOrderStatus = await UserService.addOrderToDB(
      parseInt(userId),
      orderDetail,
    );

    if (addOrderStatus.modifiedCount < 1)
      return res.status(400).json(errorResponse('Could not add order', 400));

    res.status(200).json(successResponse('Order created successfully!', null));
  } catch (err) {
    console.log(err);
    res.status(400).json(errorResponse());
  }
}

async function getAllOrders(req: Request, res: Response) {
  try {
    const userId = req.params.userId;

    // checking if user exist or not
    if (!(await User.userExist(parseInt(userId))))
      return res.status(404).json(errorResponse('User not found!', 404));

    const orders = await UserService.getAllOrdersFromDB(parseInt(userId));

    res
      .status(200)
      .json(successResponse('Order fetched successfully!', orders));
  } catch (err) {
    console.log(err);
    res.status(400).json(errorResponse());
  }
}

async function getTotalPrice(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);
    if (!(await User.userExist(userId)))
      return res.status(404).json(errorResponse('User not found!', 404));

    const totalPrice = await UserService.getTotalPriceFromDB(userId);

    res
      .status(200)
      .json(
        successResponse('Total price calculated successfully!', totalPrice),
      );
  } catch (err) {
    console.log(err);
    res.status(400).json(errorResponse());
  }
}

export const UserController = {
  createUser,
  getAllUser,
  getSpecificUser,
  updateUser,
  deleteUser,
  addOrder,
  getAllOrders,
  getTotalPrice,
};
