import { z } from 'zod';

export const FullNameValidationSubSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export const AddressValidationSubSchema = z.object({
  street: z.string(),
  city: z.string(),
  country: z.string(),
});

export const OrdersSubSchema = z.object({
  productName: z.string(),
  price: z.number(),
  quantity: z.number(),
});

export const UserValidationSchema = z.object({
  userId: z.number(),
  username: z.string(),
  password: z.string(),
  fullName: FullNameValidationSubSchema,
  age: z.number().gte(1),
  email: z.string().email(),
  isActive: z.boolean(),
  hobbies: z.string().array(),
  address: AddressValidationSubSchema,
  orders: OrdersSubSchema.array().optional(),
});

export type TUser = z.infer<typeof UserValidationSchema>;
export type TFullName = z.infer<typeof FullNameValidationSubSchema>;
export type TAddress = z.infer<typeof AddressValidationSubSchema>;
export type TOrder = z.infer<typeof OrdersSubSchema>;
