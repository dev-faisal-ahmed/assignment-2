import { z } from 'zod';

export const FullNameValidationSubSchema = z.object(
  {
    firstName: z.string({ required_error: 'firstName is required' }),
    lastName: z.string({ required_error: 'lastName is required' }),
  },
  { required_error: 'fullName is required' },
);

export const AddressValidationSubSchema = z.object(
  {
    street: z.string({ required_error: 'street is required' }),
    city: z.string({ required_error: 'city is required' }),
    country: z.string({ required_error: 'country is required' }),
  },
  { required_error: 'address is required' },
);

export const OrdersValidationSubSchema = z.object({
  productName: z.string({ required_error: 'productName is required' }),
  price: z.number({ required_error: 'price is required' }),
  quantity: z.number({ required_error: 'quantity is required' }),
});

export const UserValidationSchema = z.object({
  userId: z.number({ required_error: 'userId is required' }),
  username: z.string({ required_error: 'userName is required' }),
  password: z.string({ required_error: 'password is required' }),
  fullName: FullNameValidationSubSchema,
  age: z.number({ required_error: 'age is required' }).gte(1),
  email: z.string({ required_error: 'email is required' }).email(),
  isActive: z.boolean({ required_error: 'isActive is required' }),
  hobbies: z.string({ required_error: 'hobbies are required' }).array(),
  address: AddressValidationSubSchema,
  orders: OrdersValidationSubSchema.array().optional(),
});

export type TUser = z.infer<typeof UserValidationSchema>;
export type TFullName = z.infer<typeof FullNameValidationSubSchema>;
export type TAddress = z.infer<typeof AddressValidationSubSchema>;
export type TOrder = z.infer<typeof OrdersValidationSubSchema>;
