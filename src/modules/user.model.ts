import { Model, Schema, model } from 'mongoose';
import { TAddress, TFullName, TOrder, TUser } from './user.validation.schema';
import { bcryptSalt } from '../config/config';
import bcrypt from 'bcrypt';

interface UserModel extends Model<TUser> {
  userExist(userId: number): Promise<TUser | null>;
}

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

const OrdersSubSchema = new Schema<TOrder>({
  productName: { type: String, required: [true, 'Product name is required'] },
  price: { type: Number, required: [true, 'Price is required'] },
  quantity: { type: Number, required: [true, 'Quantity is required'] },
});

export const UserSchema = new Schema<TUser, UserModel>({
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

UserSchema.statics.userExist = async function (userId: number) {
  const user = await User.findOne({ userId }, { orders: 0 });
  return user;
};

export const User = model<TUser, UserModel>('user', UserSchema);
