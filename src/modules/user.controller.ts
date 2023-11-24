import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/helpers';
import { TUser, UserValidationSchema } from './user.validation.schema';
import { User } from './user.model';
import bcrypt from 'bcrypt';
import { bcryptSalt } from '../config/config';
import { UserService } from './user.service';

async function createUser(req: Request, res: Response) {
  try {
    let userData = req.body;
    userData = UserValidationSchema.parse(userData);
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
    res.status(400).json(errorResponse('Something went wrong', 400));
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
    res.status(400).json(errorResponse('Something went wrong', 400));
  }
}

async function updateUser(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const userInfo: TUser = req.body;

    // checking if user exist
    if (!(await User.userExist(parseInt(userId))))
      return res.status(404).json(errorResponse('User not found', 404));

    // updating the password
    userInfo.password = await bcrypt.hash(
      userInfo.password,
      parseInt(bcryptSalt),
    );
    const updateStatus = await UserService.updateUserToDB(
      parseInt(userId),
      userInfo,
    );

    if (updateStatus.modifiedCount < 1)
      return res.status(400).json(errorResponse('Could not update user', 400));

    // removing the password field
    delete userInfo.password;
    res
      .status(200)
      .json(successResponse('User updated successfully!', userInfo));
  } catch (err) {
    console.log(err);
    res.status(400).json(errorResponse('Something went wrong', 400));
  }
}

export const UserController = {
  createUser,
  getAllUser,
  getSpecificUser,
  updateUser,
};
