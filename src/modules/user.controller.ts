import { Request, Response } from 'express';
import { createUserIntoDB } from './user.service';
import { errorResponse, successResponse } from '../utils/helpers';
import { UserValidationSchema } from './user.validation.schema';
import { User } from './user.model';

async function createUser(req: Request, res: Response) {
  try {
    let userData = req.body;
    userData = UserValidationSchema.parse(userData);
    const userResponseData = await createUserIntoDB(userData);
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
    const userData = await User.find(
      {},
      { username: 1, fullName: 1, age: 1, email: 1, address: 1 },
    );
    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(400).json(errorResponse('Something went wrong', 400));
  }
}

export const UserController = {
  createUser,
  getAllUser,
};
