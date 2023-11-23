import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const port = process.env.PORT;
export const mongoUri = process.env.MONGO_URI;
export const bcryptSalt = process.env.BCRYPT_SALT_ROUND;
