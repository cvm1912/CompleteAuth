import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Hash password or OTP
export const hashValue = async (value: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(value, salt);
};

// Compare plain value with hashed
export const compareValue = async (value: string, hashed: string): Promise<boolean> => {
  return await bcrypt.compare(value, hashed);
};