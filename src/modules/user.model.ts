import { Schema, model } from 'mongoose';
import { TAddress, TFullName, TOrders, TUser } from './user.validation.schema';
import bcrypt from 'bcrypt';
import { bcryptSalt } from '../config/config';

const FullNameSubSchema = new Schema<TFullName>({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },
});

const AddressSubSchema = new Schema<TAddress>({
  street: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
});

const OrdersSubSchema = new Schema<TOrders>({
  productName: { type: String, required: [true, 'Product name is required'] },
  price: { type: Number, required: [true, 'Price is required'] },
  quantity: { type: Number, required: [true, 'Quantity is required'] },
});

export const UserSchema = new Schema<TUser>({
  userId: {
    type: Number,
    required: [true, 'User id is required'],
    unique: true,
  },

  username: {
    type: String,
    required: [true, 'User Name is required'],
    unique: true,
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },

  fullName: {
    type: FullNameSubSchema,
    required: [true, 'Full Name is required'],
  },

  age: { type: Number, required: [true, 'Age is required'] },
  email: { type: String, required: [true, 'Email is required'] },

  isActive: {
    type: Boolean,
    required: [true, 'isActive is required'],
  },

  hobbies: [{ type: String }],
  address: { type: AddressSubSchema, required: true },
  orders: [{ type: OrdersSubSchema }],
});

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, parseInt(bcryptSalt));
  next();
});

export const User = model<TUser>('user', UserSchema);
