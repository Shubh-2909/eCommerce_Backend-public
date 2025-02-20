import { userModel } from "../models/user.model";

interface CreateUserInput {
  fullName: string;
  email: string;
  password: string;
  role?: string;
  otp?: {
    code: string;
    expiry: Date;
  };
}

export const createUser = async ({
  fullName,
  email,
  password,
  role,
  otp,
}: CreateUserInput) => {
  if (!fullName || !email || !password) {
    throw new Error("All fields are required.");
  }

  const user = userModel.create({
    fullName,
    email,
    password,
    role,
    otp,
  });

  return user;
};
